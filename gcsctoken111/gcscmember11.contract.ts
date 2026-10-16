/**
 * gcscmember11 – GCSC Membership Contract
 *
 * Manages member registration, tiers, fees, and verification.
 * Tiers: 0 = BASIC | 1 = STANDARD | 2 = PREMIUM
 */
import {
    Contract, Table, TableStore, Name, Asset, Symbol,
    check, requireAuth, isAccount, currentTimeSec,
    EMPTY_NAME, ActionData, InlineAction, PermissionLevel
} from "proton-tsc";

// ─── Inline-action helper (pulls GCSC from caller via eosio.code) ─────────────

@packer
class Transfer extends ActionData {
    constructor(
        public from:     Name  = EMPTY_NAME,
        public to:       Name  = EMPTY_NAME,
        public quantity: Asset = new Asset(),
        public memo:     string = ""
    ) { super(); }
}

function sendTransfer(tokenContract: Name, from: Name, to: Name, quantity: Asset, memo: string): void {
    const action = new InlineAction<Transfer>("transfer");
    action.act(tokenContract, new PermissionLevel(from)).send(
        new Transfer(from, to, quantity, memo)
    );
}

// ─── Tables ───────────────────────────────────────────────────────────────────

// Tiers
const TIER_BASIC:    u8 = 0;
const TIER_STANDARD: u8 = 1;
const TIER_PREMIUM:  u8 = 2;

@table("members")
class Member extends Table {
    constructor(
        public account:     Name   = EMPTY_NAME,
        public full_name:   string = "",
        public email_hash:  string = "",   // keccak/sha256 of email
        public tier:        u8     = TIER_BASIC,
        public is_verified: bool   = false,
        public join_date:   u32    = 0,
        public expiry_date: u32    = 0,
        public total_paid:  i64    = 0     // cumulative fees paid (raw)
    ) { super(); }

    @primary
    get primary(): u64 { return this.account.N; }

    @secondary
    get by_tier(): u64 { return <u64>this.tier; }
    set by_tier(v: u64) { this.tier = <u8>v; }
}

@table("config")
class Config extends Table {
    constructor(
        public admin:                Name   = EMPTY_NAME,
        public token_contract:       Name   = EMPTY_NAME,
        public basic_fee:            i64    = 100_0000,   // 100.0000 GCSC
        public standard_fee:         i64    = 250_0000,
        public premium_fee:          i64    = 500_0000,
        public membership_duration:  u32    = 31_536_000, // 1 year in seconds
        public token_symbol_raw:     u64    = 0,
        public paused:               bool   = false
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

// ─── Contract ─────────────────────────────────────────────────────────────────

@contract
class gcscmember11 extends Contract {

    membersTable: TableStore<Member> = new TableStore<Member>(this.receiver);
    configTable:  TableStore<Config> = new TableStore<Config>(this.receiver);

    // ── setconfig ─────────────────────────────────────────────────────────────
    @action("setconfig")
    setconfig(
        admin:           Name,
        token_contract:  Name,
        basic_fee:       Asset,
        standard_fee:    Asset,
        premium_fee:     Asset,
        membership_secs: u32
    ): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin == EMPTY_NAME ? this.receiver : cfg.admin);

        check(isAccount(admin),          "admin account does not exist");
        check(isAccount(token_contract), "token contract does not exist");
        check(basic_fee.amount > 0,      "basic fee must be positive");
        check(standard_fee.amount > basic_fee.amount,    "standard fee must exceed basic");
        check(premium_fee.amount > standard_fee.amount,  "premium fee must exceed standard");
        check(membership_secs > 0,       "duration must be positive");

        cfg.admin               = admin;
        cfg.token_contract      = token_contract;
        cfg.basic_fee           = basic_fee.amount;
        cfg.standard_fee        = standard_fee.amount;
        cfg.premium_fee         = premium_fee.amount;
        cfg.membership_duration = membership_secs;
        cfg.token_symbol_raw    = basic_fee.symbol.value;
        this.configTable.set(cfg, this.receiver);
    }

    // ── regmember ─────────────────────────────────────────────────────────────
    @action("regmember")
    regmember(account: Name, full_name: string, email_hash: string, tier: u8): void {
        requireAuth(account);

        const cfg = this.getConfig();
        check(!cfg.paused,          "contract is paused");
        check(isAccount(account),   "account does not exist");
        check(full_name.length > 0, "full name required");
        check(email_hash.length > 0,"email hash required");
        check(tier <= TIER_PREMIUM, "invalid tier");
        check(!this.membersTable.exists(account.N), "account is already a member");

        const fee = this.feeForTier(tier, cfg);
        const sym = Symbol.fromU64(cfg.token_symbol_raw);

        // Pull fee from member via eosio.code permission
        sendTransfer(
            cfg.token_contract, account, this.receiver,
            new Asset(fee, sym), "membership fee"
        );

        const now     = <u32>currentTimeSec();
        const expiry  = now + cfg.membership_duration;
        this.membersTable.store(
            new Member(account, full_name, email_hash, tier, false, now, expiry, fee),
            account
        );
    }

    // ── renewmember ───────────────────────────────────────────────────────────
    @action("renewmember")
    renewmember(account: Name): void {
        requireAuth(account);

        const cfg    = this.getConfig();
        check(!cfg.paused, "contract is paused");
        const member = this.membersTable.requireGet(account.N, "member not found");
        const fee    = this.feeForTier(member.tier, cfg);
        const sym    = Symbol.fromU64(cfg.token_symbol_raw);

        sendTransfer(
            cfg.token_contract, account, this.receiver,
            new Asset(fee, sym), "membership renewal"
        );

        const now           = <u32>currentTimeSec();
        const base          = member.expiry_date > now ? member.expiry_date : now;
        member.expiry_date  = base + cfg.membership_duration;
        member.total_paid  += fee;
        this.membersTable.update(member, account);
    }

    // ── upgrmember ────────────────────────────────────────────────────────────
    @action("upgrmember")
    upgrmember(account: Name, new_tier: u8): void {
        requireAuth(account);

        const cfg    = this.getConfig();
        check(!cfg.paused, "contract is paused");
        const member = this.membersTable.requireGet(account.N, "member not found");
        check(new_tier > member.tier,    "can only upgrade to a higher tier");
        check(new_tier <= TIER_PREMIUM,  "invalid tier");

        const extra_fee = this.feeForTier(new_tier, cfg) - this.feeForTier(member.tier, cfg);
        const sym       = Symbol.fromU64(cfg.token_symbol_raw);

        sendTransfer(
            cfg.token_contract, account, this.receiver,
            new Asset(extra_fee, sym), "tier upgrade"
        );

        member.tier        = new_tier;
        member.total_paid += extra_fee;
        this.membersTable.update(member, account);
    }

    // ── updmember ─────────────────────────────────────────────────────────────
    @action("updmember")
    updmember(account: Name, full_name: string, email_hash: string): void {
        requireAuth(account);
        const member     = this.membersTable.requireGet(account.N, "member not found");
        check(full_name.length > 0,  "full name required");
        check(email_hash.length > 0, "email hash required");
        member.full_name  = full_name;
        member.email_hash = email_hash;
        this.membersTable.update(member, account);
    }

    // ── verifymember ──────────────────────────────────────────────────────────
    @action("verifymember")
    verifymember(account: Name): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        const member       = this.membersTable.requireGet(account.N, "member not found");
        member.is_verified = true;
        this.membersTable.update(member, this.receiver);
    }

    // ── removemember ──────────────────────────────────────────────────────────
    @action("removemember")
    removemember(account: Name): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        const member = this.membersTable.requireGet(account.N, "member not found");
        this.membersTable.remove(member);
    }

    // ── pause / unpause ───────────────────────────────────────────────────────
    @action("pause")
    pause(paused: bool): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        cfg.paused = paused;
        this.configTable.set(cfg, this.receiver);
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

    feeForTier(tier: u8, cfg: Config): i64 {
        if (tier == TIER_STANDARD) return cfg.standard_fee;
        if (tier == TIER_PREMIUM)  return cfg.premium_fee;
        return cfg.basic_fee;
    }
}
