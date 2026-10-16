import * as _chain from "as-chain";
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


@packer(nocodegen)
class Transfer implements _chain.Packer {
    
    constructor(
        public from:     Name  = EMPTY_NAME,
        public to:       Name  = EMPTY_NAME,
        public quantity: Asset = new Asset(),
        public memo:     string = ""
    ) {  }
    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.from);
        enc.pack(this.to);
        enc.pack(this.quantity);
        enc.packString(this.memo);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.from = obj;
        }
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.to = obj;
        }
        
        {
            let obj = new Asset();
            dec.unpack(obj);
            this.quantity = obj;
        }
        this.memo = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.from.getSize();
        size += this.to.getSize();
        size += this.quantity.getSize();
        size += _chain.Utils.calcPackedStringLength(this.memo);
        return size;
    }
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



class PropertyDB extends _chain.MultiIndex<Property> {
    get by_statusDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[0];
    }

    
    updateBy_status(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

}

@table("properties", nocodegen)

class Property implements _chain.MultiIndexValue {
    
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
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.packString(this.name);
        enc.packString(this.location);
        enc.packString(this.description);
        enc.packNumber<i64>(this.target_amount);
        enc.packNumber<i64>(this.raised_amount);
        enc.packNumber<u64>(this.total_shares);
        enc.packNumber<i64>(this.income_pool);
        enc.packNumber<i64>(this.distributed);
        enc.packNumber<u8>(this.status);
        enc.packNumber<u32>(this.listed_at);
        enc.packNumber<u32>(this.activated_at);
        enc.packNumber<i64>(this.valuation);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u64>();
        this.name = dec.unpackString();
        this.location = dec.unpackString();
        this.description = dec.unpackString();
        this.target_amount = dec.unpackNumber<i64>();
        this.raised_amount = dec.unpackNumber<i64>();
        this.total_shares = dec.unpackNumber<u64>();
        this.income_pool = dec.unpackNumber<i64>();
        this.distributed = dec.unpackNumber<i64>();
        this.status = dec.unpackNumber<u8>();
        this.listed_at = dec.unpackNumber<u32>();
        this.activated_at = dec.unpackNumber<u32>();
        this.valuation = dec.unpackNumber<i64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += _chain.Utils.calcPackedStringLength(this.name);
        size += _chain.Utils.calcPackedStringLength(this.location);
        size += _chain.Utils.calcPackedStringLength(this.description);
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<u64>();
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<u8>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<i64>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xADE9555F2E560000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
            new _chain.IDX64(code.N, scope.N, idxTableBase + 0, 0),
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Property.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Property.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        switch (i) {
            case 0: {
                return _chain.newSecondaryValue_u64(this.by_status);
                break;
            }
            default:
                _chain.assert(false, "bad db index!");
                return new _chain.SecondaryValue(_chain.SecondaryType.U64, new Array<u64>(0));
        }
    }

    setSecondaryValue(i: i32, value: _chain.SecondaryValue): void {
        switch (i) {
            case 0: {
                let _value = _chain.getSecondaryValue_u64(value);
                this.by_status = _value;
                break;
            }
            default:
                _chain.assert(false, "bad db index!");
        }
    }


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): PropertyDB {
        return new PropertyDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class InvestmentDB extends _chain.MultiIndex<Investment> {
    get by_propertyDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[0];
    }
    get by_investorDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[1];
    }

    
    updateBy_property(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

    
    updateBy_investor(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

}

@table("investments", nocodegen)

class Investment implements _chain.MultiIndexValue {
    
    constructor(
        public id:             u64  = 0,
        public property_id:    u64  = 0,
        public investor:       Name = EMPTY_NAME,
        public shares:         i64  = 0,
        public invested_at:    u32  = 0,
        public claimed_income: i64  = 0   // total income already claimed
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_property(): u64 { return this.property_id; }
    set by_property(v: u64) { this.property_id = v; }

    @secondary
    get by_investor(): u64 { return this.investor.N; }
    set by_investor(v: u64) { this.investor = new Name(v); }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.packNumber<u64>(this.property_id);
        enc.pack(this.investor);
        enc.packNumber<i64>(this.shares);
        enc.packNumber<u32>(this.invested_at);
        enc.packNumber<i64>(this.claimed_income);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u64>();
        this.property_id = dec.unpackNumber<u64>();
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.investor = obj;
        }
        this.shares = dec.unpackNumber<i64>();
        this.invested_at = dec.unpackNumber<u32>();
        this.claimed_income = dec.unpackNumber<i64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += sizeof<u64>();
        size += this.investor.getSize();
        size += sizeof<i64>();
        size += sizeof<u32>();
        size += sizeof<i64>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x74F6AC664A9E7000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
            new _chain.IDX64(code.N, scope.N, idxTableBase + 0, 0),
            new _chain.IDX64(code.N, scope.N, idxTableBase + 1, 1),
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Investment.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Investment.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        switch (i) {
            case 0: {
                return _chain.newSecondaryValue_u64(this.by_property);
                break;
            }
            case 1: {
                return _chain.newSecondaryValue_u64(this.by_investor);
                break;
            }
            default:
                _chain.assert(false, "bad db index!");
                return new _chain.SecondaryValue(_chain.SecondaryType.U64, new Array<u64>(0));
        }
    }

    setSecondaryValue(i: i32, value: _chain.SecondaryValue): void {
        switch (i) {
            case 0: {
                let _value = _chain.getSecondaryValue_u64(value);
                this.by_property = _value;
                break;
            }
            case 1: {
                let _value = _chain.getSecondaryValue_u64(value);
                this.by_investor = _value;
                break;
            }
            default:
                _chain.assert(false, "bad db index!");
        }
    }


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): InvestmentDB {
        return new InvestmentDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class ConfigDB extends _chain.MultiIndex<Config> {

}

@table("config", nocodegen)

class Config implements _chain.MultiIndexValue {
    
    constructor(
        public admin:            Name = EMPTY_NAME,
        public token_contract:   Name = EMPTY_NAME,
        public token_symbol_raw: u64  = 0,
        public platform_fee_bps: u32  = 200,   // 2.00% platform fee
        public min_investment:   i64  = 1000_0000,  // 1000.0000 GCSC
        public paused:           bool = false
    ) {  }

    @primary
    get primary(): u64 { return 0; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin);
        enc.pack(this.token_contract);
        enc.packNumber<u64>(this.token_symbol_raw);
        enc.packNumber<u32>(this.platform_fee_bps);
        enc.packNumber<i64>(this.min_investment);
        enc.packNumber<bool>(this.paused);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.admin = obj;
        }
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.token_contract = obj;
        }
        this.token_symbol_raw = dec.unpackNumber<u64>();
        this.platform_fee_bps = dec.unpackNumber<u32>();
        this.min_investment = dec.unpackNumber<i64>();
        this.paused = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin.getSize();
        size += this.token_contract.getSize();
        size += sizeof<u64>();
        size += sizeof<u32>();
        size += sizeof<i64>();
        size += sizeof<bool>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x4526B73000000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Config.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Config.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        _chain.check(false, "no secondary value!");
        return new _chain.SecondaryValue(_chain.SecondaryType.U64, new Array<u64>(0));
    }
    
    setSecondaryValue(i: i32, value: _chain.SecondaryValue): void {
        _chain.check(false, "no secondary value!");
    }


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): ConfigDB {
        return new ConfigDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
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


class setconfigAction implements _chain.Packer {
    constructor (
        public admin: _chain.Name | null = null,
        public token_contract: _chain.Name | null = null,
        public token_symbol: _chain.Symbol | null = null,
        public platform_fee_bps: u32 = 0,
        public min_investment: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin!);
        enc.pack(this.token_contract!);
        enc.pack(this.token_symbol!);
        enc.packNumber<u32>(this.platform_fee_bps);
        enc.pack(this.min_investment!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.admin! = obj;
        }
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.token_contract! = obj;
        }
        
        {
            let obj = new _chain.Symbol();
            dec.unpack(obj);
            this.token_symbol! = obj;
        }
        this.platform_fee_bps = dec.unpackNumber<u32>();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.min_investment! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin!.getSize();
        size += this.token_contract!.getSize();
        size += this.token_symbol!.getSize();
        size += sizeof<u32>();
        size += this.min_investment!.getSize();
        return size;
    }
}

class listpropAction implements _chain.Packer {
    constructor (
        public name: string = "",
        public location: string = "",
        public description: string = "",
        public target_amount: _chain.Asset | null = null,
        public valuation: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packString(this.name);
        enc.packString(this.location);
        enc.packString(this.description);
        enc.pack(this.target_amount!);
        enc.pack(this.valuation!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.name = dec.unpackString();
        this.location = dec.unpackString();
        this.description = dec.unpackString();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.target_amount! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.valuation! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += _chain.Utils.calcPackedStringLength(this.name);
        size += _chain.Utils.calcPackedStringLength(this.location);
        size += _chain.Utils.calcPackedStringLength(this.description);
        size += this.target_amount!.getSize();
        size += this.valuation!.getSize();
        return size;
    }
}

class investAction implements _chain.Packer {
    constructor (
        public investor: _chain.Name | null = null,
        public property_id: u64 = 0,
        public amount: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.investor!);
        enc.packNumber<u64>(this.property_id);
        enc.pack(this.amount!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.investor! = obj;
        }
        this.property_id = dec.unpackNumber<u64>();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.amount! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.investor!.getSize();
        size += sizeof<u64>();
        size += this.amount!.getSize();
        return size;
    }
}

class activatepropAction implements _chain.Packer {
    constructor (
        public property_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.property_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.property_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        return size;
    }
}

class addincomeAction implements _chain.Packer {
    constructor (
        public property_id: u64 = 0,
        public income: _chain.Asset | null = null,
        public memo: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.property_id);
        enc.pack(this.income!);
        enc.packString(this.memo);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.property_id = dec.unpackNumber<u64>();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.income! = obj;
        }
        this.memo = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += this.income!.getSize();
        size += _chain.Utils.calcPackedStringLength(this.memo);
        return size;
    }
}

class claimincomeAction implements _chain.Packer {
    constructor (
        public investor: _chain.Name | null = null,
        public investment_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.investor!);
        enc.packNumber<u64>(this.investment_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.investor! = obj;
        }
        this.investment_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.investor!.getSize();
        size += sizeof<u64>();
        return size;
    }
}

class updpropAction implements _chain.Packer {
    constructor (
        public property_id: u64 = 0,
        public description: string = "",
        public valuation: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.property_id);
        enc.packString(this.description);
        enc.pack(this.valuation!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.property_id = dec.unpackNumber<u64>();
        this.description = dec.unpackString();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.valuation! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += _chain.Utils.calcPackedStringLength(this.description);
        size += this.valuation!.getSize();
        return size;
    }
}

class closepropAction implements _chain.Packer {
    constructor (
        public property_id: u64 = 0,
        public proceeds: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.property_id);
        enc.pack(this.proceeds!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.property_id = dec.unpackNumber<u64>();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.proceeds! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += this.proceeds!.getSize();
        return size;
    }
}

class cancelpropAction implements _chain.Packer {
    constructor (
        public property_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.property_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.property_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        return size;
    }
}

class refundAction implements _chain.Packer {
    constructor (
        public investor: _chain.Name | null = null,
        public investment_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.investor!);
        enc.packNumber<u64>(this.investment_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.investor! = obj;
        }
        this.investment_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.investor!.getSize();
        size += sizeof<u64>();
        return size;
    }
}

export function apply(receiver: u64, firstReceiver: u64, action: u64): void {
	const _receiver = new _chain.Name(receiver);
	const _firstReceiver = new _chain.Name(firstReceiver);
	const _action = new _chain.Name(action);

	const mycontract = new gcscrealty11(_receiver, _firstReceiver, _action);
	const actionData = _chain.readActionData();

	if (receiver == firstReceiver) {
		if (action == 0xC2B28A4D6E600000) {//setconfig
            const args = new setconfigAction();
            args.unpack(actionData);
            mycontract.setconfig(args.admin!,args.token_contract!,args.token_symbol!,args.platform_fee_bps,args.min_investment!);
        }
		if (action == 0x8BB19ADE95000000) {//listprop
            const args = new listpropAction();
            args.unpack(actionData);
            mycontract.listprop(args.name,args.location,args.description,args.target_amount!,args.valuation!);
        }
		if (action == 0x74F6AC6400000000) {//invest
            const args = new investAction();
            args.unpack(actionData);
            mycontract.invest(args.investor!,args.property_id,args.amount!);
        }
		if (action == 0x3232ED9B2AADE950) {//activateprop
            const args = new activatepropAction();
            args.unpack(actionData);
            mycontract.activateprop(args.property_id);
        }
		if (action == 0x3252E9A292500000) {//addincome
            const args = new addincomeAction();
            args.unpack(actionData);
            mycontract.addincome(args.property_id,args.income!,args.memo);
        }
		if (action == 0x444CE93A68A49400) {//claimincome
            const args = new claimincomeAction();
            args.unpack(actionData);
            mycontract.claimincome(args.investor!,args.investment_id);
        }
		if (action == 0xD5535BD2A0000000) {//updprop
            const args = new updpropAction();
            args.unpack(actionData);
            mycontract.updprop(args.property_id,args.description,args.valuation!);
        }
		if (action == 0x44698556F4A80000) {//closeprop
            const args = new closepropAction();
            args.unpack(actionData);
            mycontract.closeprop(args.property_id,args.proceeds!);
        }
		if (action == 0x41A68546B7A54000) {//cancelprop
            const args = new cancelpropAction();
            args.unpack(actionData);
            mycontract.cancelprop(args.property_id);
        }
		if (action == 0xBA97A9A400000000) {//refund
            const args = new refundAction();
            args.unpack(actionData);
            mycontract.refund(args.investor!,args.investment_id);
        }
	}
  
	if (receiver != firstReceiver) {
		
	}
	return;
}
