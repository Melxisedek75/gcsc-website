/**
 * gcscrealty11 – GCSC Real Estate Investment Contract
 *
 * Members invest in pooled real-estate properties.
 * Property status: 0=LISTED | 1=FUNDING | 2=ACTIVE | 3=SOLD | 4=CANCELLED
 *
 * Investment flow:
 *   1. Admin lists a property (listprop).
 *   2. Members invest GCSC tokens (invest).  Tokens pulled via eosio.code.
 *   3. When target met, admin activates property (activateprop).
 *   4. Admin records rental income (addincome).
 *   5. Members claim their share of income (claimincome).
 *   6. Admin can sell/close property (closeprop), triggering principal distribution.
 */
import {
    Contract, Table, TableStore, Name, Asset, Symbol,
    check, requireAuth, isAccount, currentTimeSec,
    EMPTY_NAME, ActionData, InlineAction, PermissionLevel
} from "proton-tsc";

// ─── Inline transfer helper ───────────────────────────────────────────────────

@packer
class Transfer extends ActionData {
    constructor(
        public from:     Name  = EMPTY_NAME,
        public to:       Name  = EMPTY_NAME,
        public quantity: Asset = new Asset(),
        public memo:     string = ""
    ) { super(); }
}

function sendTransfer(contract: Name, from: Name, to: Name, quantity: Asset, memo: string): void {
    new InlineAction<Transfer>("transfer")
        .act(contract, new PermissionLevel(from))
        .send(new Transfer(from, to, quantity, memo));
}

// ─── Tables ───────────────────────────────────────────────────────────────────

const STATUS_LISTED:    u8 = 0;
const STATUS_FUNDING:   u8 = 1;
const STATUS_ACTIVE:    u8 = 2;
const STATUS_SOLD:      u8 = 3;
const STATUS_CANCELLED: u8 = 4;

@table("properties")
class Property extends Table {
    constructor(
        public id:              u64    = 0,
        public name:            string = "",
        public location:        string = "",
        public description:     string = "",
        public target_amount:   i64    = 0,    // fundraising target
        public raised_amount:   i64    = 0,
        public total_shares:    u64    = 0,    // 1 share = 1 GCSC unit invested
        public income_pool:     i64    = 0,    // accumulated rental income
        public distributed:     i64    = 0,
        public status:          u8     = STATUS_LISTED,
        public listed_at:       u32    = 0,
        public activated_at:    u32    = 0,
        public valuation:       i64    = 0     // current estimated value
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }
}

@table("investments")
class Investment extends Table {
    constructor(
        public id:             u64  = 0,
        public property_id:    u64  = 0,
        public investor:       Name = EMPTY_NAME,
        public shares:         i64  = 0,
        public invested_at:    u32  = 0,
        public claimed_income: i64  = 0   // total income already claimed
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_property(): u64 { return this.property_id; }
    set by_property(v: u64) { this.property_id = v; }

    @secondary
    get by_investor(): u64 { return this.investor.N; }
    set by_investor(v: u64) { this.investor = new Name(v); }
}

@table("config")
class Config extends Table {
    constructor(
        public admin:            Name = EMPTY_NAME,
        public token_contract:   Name = EMPTY_NAME,
        public token_symbol_raw: u64  = 0,
        public platform_fee_bps: u32  = 200,   // 2.00% platform fee
        public min_investment:   i64  = 1000_0000,  // 1000.0000 GCSC
        public paused:           bool = false
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

// ─── Contract ─────────────────────────────────────────────────────────────────

@contract
class gcscrealty11 extends Contract {

    propsTable:    TableStore<Property>   = new TableStore<Property>(this.receiver);
    investTable:   TableStore<Investment> = new TableStore<Investment>(this.receiver);
    configTable:   TableStore<Config>     = new TableStore<Config>(this.receiver);

    // ── setconfig ─────────────────────────────────────────────────────────────
    @action("setconfig")
    setconfig(
        admin:            Name,
        token_contract:   Name,
        token_symbol:     Symbol,
        platform_fee_bps: u32,
        min_investment:   Asset
    ): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin == EMPTY_NAME ? this.receiver : cfg.admin);

        check(isAccount(admin),           "admin does not exist");
        check(isAccount(token_contract),  "token contract does not exist");
        check(platform_fee_bps < 5000,    "fee cannot exceed 50%");
        check(min_investment.amount > 0,  "min investment must be positive");

        cfg.admin            = admin;
        cfg.token_contract   = token_contract;
        cfg.token_symbol_raw = token_symbol.value;
        cfg.platform_fee_bps = platform_fee_bps;
        cfg.min_investment   = min_investment.amount;
        this.configTable.set(cfg, this.receiver);
    }

    // ── listprop ──────────────────────────────────────────────────────────────
    @action("listprop")
    listprop(
        name:          string,
        location:      string,
        description:   string,
        target_amount: Asset,
        valuation:     Asset
    ): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(!cfg.paused,            "contract is paused");
        check(name.length > 0,        "name required");
        check(location.length > 0,    "location required");
        check(description.length > 0, "description required");
        check(target_amount.amount > 0,"target must be positive");
        check(target_amount.symbol.value == cfg.token_symbol_raw, "wrong symbol");
        check(valuation.amount > 0,   "valuation must be positive");

        const id = this.propsTable.availablePrimaryKey;
        this.propsTable.store(
            new Property(
                id, name, location, description,
                target_amount.amount, 0, 0, 0, 0,
                STATUS_LISTING(), <u32>currentTimeSec(), 0, valuation.amount
            ),
            this.receiver
        );
    }

    // ── invest ────────────────────────────────────────────────────────────────
    @action("invest")
    invest(investor: Name, property_id: u64, amount: Asset): void {
        requireAuth(investor);

        const cfg  = this.getConfig();
        check(!cfg.paused,          "contract is paused");
        check(isAccount(investor),  "investor does not exist");
        check(amount.isValid(),     "invalid amount");
        check(amount.amount >= cfg.min_investment, "below minimum investment");
        check(amount.symbol.value == cfg.token_symbol_raw, "wrong token symbol");

        const prop = this.propsTable.requireGet(property_id, "property not found");
        check(prop.status == STATUS_LISTED || prop.status == STATUS_FUNDING,
              "property is not open for investment");
        check(prop.raised_amount + amount.amount <= prop.target_amount,
              "investment would exceed target");

        // Pull tokens from investor
        sendTransfer(cfg.token_contract, investor, this.receiver, amount, "property investment");

        // Platform fee
        const fee      = (amount.amount * <i64>cfg.platform_fee_bps) / 10000;
        const netShares = amount.amount - fee;

        // Update investment record (combine if same investor & property)
        let found: Investment | null = null;
        let inv = this.investTable.getBySecondaryU64(property_id, 0);
        while (inv) {
            if (inv.property_id == property_id && inv.investor == investor) {
                found = inv;
                break;
            }
            inv = this.investTable.next(inv);
        }

        if (!found) {
            const id = this.investTable.availablePrimaryKey;
            this.investTable.store(
                new Investment(id, property_id, investor, netShares, <u32>currentTimeSec(), 0),
                investor
            );
        } else {
            found.shares += netShares;
            this.investTable.update(found, investor);
        }

        prop.raised_amount += amount.amount;
        prop.total_shares  += <u64>netShares;
        if (prop.status == STATUS_LISTED) prop.status = STATUS_FUNDING;
        this.propsTable.update(prop, this.receiver);
    }

    // ── activateprop ──────────────────────────────────────────────────────────
    @action("activateprop")
    activateprop(property_id: u64): void {
        const cfg  = this.getConfig();
        requireAuth(cfg.admin);
        const prop = this.propsTable.requireGet(property_id, "property not found");
        check(prop.status == STATUS_FUNDING, "property must be in funding status");
        check(prop.raised_amount >= prop.target_amount, "funding target not yet reached");
        prop.status       = STATUS_ACTIVE;
        prop.activated_at = <u32>currentTimeSec();
        this.propsTable.update(prop, this.receiver);
    }

    // ── addincome ─────────────────────────────────────────────────────────────
    @action("addincome")
    addincome(property_id: u64, income: Asset, memo: string): void {
        const cfg  = this.getConfig();
        requireAuth(cfg.admin);
        const prop = this.propsTable.requireGet(property_id, "property not found");
        check(prop.status == STATUS_ACTIVE,  "property must be active");
        check(income.isValid(),              "invalid income amount");
        check(income.amount > 0,             "income must be positive");
        check(income.symbol.value == cfg.token_symbol_raw, "wrong symbol");

        // Admin deposits income into contract (requires eosio.code or separate deposit)
        sendTransfer(cfg.token_contract, cfg.admin, this.receiver, income, memo);

        prop.income_pool += income.amount;
        this.propsTable.update(prop, this.receiver);
    }

    // ── claimincome ───────────────────────────────────────────────────────────
    @action("claimincome")
    claimincome(investor: Name, investment_id: u64): void {
        requireAuth(investor);

        const cfg = this.getConfig();
        const inv = this.investTable.requireGet(investment_id, "investment not found");
        check(inv.investor == investor, "not your investment");

        const prop = this.propsTable.requireGet(inv.property_id, "property not found");
        check(prop.total_shares > 0,   "no shares outstanding");

        const total_income  = prop.income_pool + prop.distributed;
        const share_income  = (total_income * inv.shares) / <i64>prop.total_shares;
        const claimable     = share_income - inv.claimed_income;
        check(claimable > 0, "no income to claim");

        const sym = Symbol.fromU64(cfg.token_symbol_raw);
        sendTransfer(cfg.token_contract, this.receiver, investor, new Asset(claimable, sym), "rental income");

        inv.claimed_income   += claimable;
        this.investTable.update(inv, investor);

        prop.income_pool  = prop.income_pool > claimable ? prop.income_pool - claimable : 0;
        prop.distributed += claimable;
        this.propsTable.update(prop, this.receiver);
    }

    // ── updprop ───────────────────────────────────────────────────────────────
    @action("updprop")
    updprop(property_id: u64, description: string, valuation: Asset): void {
        const cfg  = this.getConfig();
        requireAuth(cfg.admin);
        const prop = this.propsTable.requireGet(property_id, "property not found");
        check(description.length > 0, "description required");
        check(valuation.amount > 0,   "valuation must be positive");
        prop.description = description;
        prop.valuation   = valuation.amount;
        this.propsTable.update(prop, this.receiver);
    }

    // ── closeprop ─────────────────────────────────────────────────────────────
    @action("closeprop")
    closeprop(property_id: u64, proceeds: Asset): void {
        const cfg  = this.getConfig();
        requireAuth(cfg.admin);
        const prop = this.propsTable.requireGet(property_id, "property not found");
        check(
            prop.status == STATUS_ACTIVE || prop.status == STATUS_FUNDING,
            "property must be active or funding"
        );
        check(proceeds.isValid() && proceeds.amount >= 0, "invalid proceeds");
        check(proceeds.symbol.value == cfg.token_symbol_raw, "wrong symbol");

        if (proceeds.amount > 0) {
            sendTransfer(cfg.token_contract, cfg.admin, this.receiver, proceeds, "property sale proceeds");
            prop.income_pool += proceeds.amount;
        }

        prop.status = STATUS_SOLD;
        this.propsTable.update(prop, this.receiver);
    }

    // ── cancelprop ────────────────────────────────────────────────────────────
    @action("cancelprop")
    cancelprop(property_id: u64): void {
        const cfg  = this.getConfig();
        requireAuth(cfg.admin);
        const prop = this.propsTable.requireGet(property_id, "property not found");
        check(prop.status == STATUS_LISTED || prop.status == STATUS_FUNDING,
              "can only cancel listed or funding properties");
        prop.status = STATUS_CANCELLED;
        this.propsTable.update(prop, this.receiver);
        // Investors must call refund action to retrieve their investment
    }

    // ── refund ────────────────────────────────────────────────────────────────
    @action("refund")
    refund(investor: Name, investment_id: u64): void {
        requireAuth(investor);

        const cfg  = this.getConfig();
        const inv  = this.investTable.requireGet(investment_id, "investment not found");
        check(inv.investor == investor, "not your investment");

        const prop = this.propsTable.requireGet(inv.property_id, "property not found");
        check(prop.status == STATUS_CANCELLED, "property must be cancelled for refund");

        const sym = Symbol.fromU64(cfg.token_symbol_raw);
        sendTransfer(cfg.token_contract, this.receiver, investor, new Asset(inv.shares, sym), "investment refund");

        prop.total_shares  = prop.total_shares > <u64>inv.shares
            ? prop.total_shares - <u64>inv.shares : 0;
        this.propsTable.update(prop, this.receiver);
        this.investTable.remove(inv);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    getConfig(): Config {
        let cfg = this.configTable.get(0);
        if (!cfg) {
            cfg = new Config();
            cfg.admin = this.receiver;
            this.configTable.store(cfg, this.receiver);
        }
        return cfg;
    }
}

function STATUS_LISTING(): u8 { return STATUS_LISTED; }
