/**
 * gcscinsure11 – GCSC Insurance Contract
 *
 * Members purchase insurance policies and file claims.
 *
 * Policy types : 0=HEALTH | 1=LIFE | 2=PROPERTY | 3=GENERAL
 * Policy status: 0=ACTIVE | 1=EXPIRED | 2=CANCELLED
 * Claim status : 0=FILED | 1=UNDER_REVIEW | 2=APPROVED | 3=REJECTED | 4=PAID
 *
 * Premium flow : policyholder gives gcscinsure11@eosio.code permission,
 *                then calls paypremium(). Tokens pulled inline.
 * Claim flow   : file claim → admin reviews → admin approves/rejects → auto-pay on approval.
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

// ─── Constants ────────────────────────────────────────────────────────────────

const PTYPE_HEALTH:   u8 = 0;
const PTYPE_LIFE:     u8 = 1;
const PTYPE_PROPERTY: u8 = 2;
const PTYPE_GENERAL:  u8 = 3;

const PSTAT_ACTIVE:    u8 = 0;
const PSTAT_EXPIRED:   u8 = 1;
const PSTAT_CANCELLED: u8 = 2;

const CSTAT_FILED:      u8 = 0;
const CSTAT_REVIEWING:  u8 = 1;
const CSTAT_APPROVED:   u8 = 2;
const CSTAT_REJECTED:   u8 = 3;
const CSTAT_PAID:       u8 = 4;

// ─── Tables ───────────────────────────────────────────────────────────────────

@table("policies")
class Policy extends Table {
    constructor(
        public id:             u64  = 0,
        public holder:         Name = EMPTY_NAME,
        public policy_type:    u8   = PTYPE_GENERAL,
        public coverage:       i64  = 0,        // max payout per claim
        public premium:        i64  = 0,        // periodic premium amount
        public period_secs:    u32  = 2_592_000, // payment interval (30 days)
        public status:         u8   = PSTAT_ACTIVE,
        public start_date:     u32  = 0,
        public end_date:       u32  = 0,
        public next_due:       u32  = 0,
        public total_paid:     i64  = 0,
        public active_claims:  u32  = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_holder(): u64 { return this.holder.N; }
    set by_holder(v: u64) { this.holder = new Name(v); }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }
}

@table("claims")
class Claim extends Table {
    constructor(
        public id:           u64    = 0,
        public policy_id:    u64    = 0,
        public claimant:     Name   = EMPTY_NAME,
        public amount:       i64    = 0,
        public description:  string = "",
        public evidence:     string = "",   // IPFS hash or reference
        public status:       u8     = CSTAT_FILED,
        public filed_at:     u32    = 0,
        public resolved_at:  u32    = 0,
        public reject_reason:string = ""
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_policy(): u64 { return this.policy_id; }
    set by_policy(v: u64) { this.policy_id = v; }

    @secondary
    get by_claimant(): u64 { return this.claimant.N; }
    set by_claimant(v: u64) { this.claimant = new Name(v); }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }
}

@table("pool")
class InsurancePool extends Table {
    constructor(
        public total_premiums:   i64 = 0,
        public total_payouts:    i64 = 0,
        public reserve:          i64 = 0,   // admin-deposited reserve
        public pending_claims:   i64 = 0    // total amount of filed claims
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

@table("products")
class InsuranceProduct extends Table {
    constructor(
        public id:           u8   = 0,   // policy_type id
        public name:         string = "",
        public min_premium:  i64   = 0,
        public max_coverage: i64   = 0,
        public min_term:     u32   = 0,  // minimum policy duration in seconds
        public available:    bool  = true
    ) { super(); }

    @primary
    get primary(): u64 { return <u64>this.id; }
}

@table("config")
class Config extends Table {
    constructor(
        public admin:            Name = EMPTY_NAME,
        public token_contract:   Name = EMPTY_NAME,
        public token_symbol_raw: u64  = 0,
        public reserve_ratio:    u32  = 2000,   // 20% of premiums kept as reserve (bps)
        public paused:           bool = false
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

// ─── Contract ─────────────────────────────────────────────────────────────────

@contract
class gcscinsure11 extends Contract {

    policiesTable:  TableStore<Policy>          = new TableStore<Policy>(this.receiver);
    claimsTable:    TableStore<Claim>           = new TableStore<Claim>(this.receiver);
    poolTable:      TableStore<InsurancePool>   = new TableStore<InsurancePool>(this.receiver);
    productsTable:  TableStore<InsuranceProduct>= new TableStore<InsuranceProduct>(this.receiver);
    configTable:    TableStore<Config>          = new TableStore<Config>(this.receiver);

    // ── setconfig ─────────────────────────────────────────────────────────────
    @action("setconfig")
    setconfig(
        admin:          Name,
        token_contract: Name,
        token_symbol:   Symbol,
        reserve_ratio:  u32
    ): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin == EMPTY_NAME ? this.receiver : cfg.admin);

        check(isAccount(admin),          "admin does not exist");
        check(isAccount(token_contract), "token contract does not exist");
        check(reserve_ratio <= 10000,    "reserve ratio cannot exceed 100%");

        cfg.admin            = admin;
        cfg.token_contract   = token_contract;
        cfg.token_symbol_raw = token_symbol.value;
        cfg.reserve_ratio    = reserve_ratio;
        this.configTable.set(cfg, this.receiver);
    }

    // ── setproduct ────────────────────────────────────────────────────────────
    @action("setproduct")
    setproduct(
        policy_type:  u8,
        name:         string,
        min_premium:  Asset,
        max_coverage: Asset,
        min_term:     u32,
        available:    bool
    ): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(policy_type <= PTYPE_GENERAL, "invalid policy type");
        check(name.length > 0,             "name required");
        check(min_premium.amount > 0,      "min premium must be positive");
        check(max_coverage.amount > 0,     "max coverage must be positive");
        check(min_term > 0,                "min term must be positive");

        const row = new InsuranceProduct(
            policy_type, name, min_premium.amount, max_coverage.amount, min_term, available
        );
        this.productsTable.set(row, this.receiver);
    }

    // ── createpolicy ──────────────────────────────────────────────────────────
    @action("createpolicy")
    createpolicy(
        holder:      Name,
        policy_type: u8,
        coverage:    Asset,
        premium:     Asset,
        term_secs:   u32
    ): void {
        requireAuth(holder);

        const cfg = this.getConfig();
        check(!cfg.paused,          "contract is paused");
        check(isAccount(holder),    "holder does not exist");
        check(policy_type <= PTYPE_GENERAL, "invalid policy type");
        check(coverage.isValid() && coverage.amount > 0, "invalid coverage");
        check(premium.isValid()  && premium.amount  > 0, "invalid premium");
        check(coverage.symbol.value == cfg.token_symbol_raw, "wrong coverage symbol");
        check(premium.symbol.value  == cfg.token_symbol_raw, "wrong premium symbol");
        check(term_secs > 0,        "term must be positive");

        const product = this.productsTable.requireGet(<u64>policy_type, "policy type not configured");
        check(product.available,                       "policy type is not available");
        check(premium.amount  >= product.min_premium,  "premium below minimum");
        check(coverage.amount <= product.max_coverage, "coverage exceeds maximum");
        check(term_secs >= product.min_term,            "term below minimum");

        // Pull first premium payment
        sendTransfer(cfg.token_contract, holder, this.receiver, premium, "initial premium");

        this.updatePool(premium.amount, 0, 0, cfg);

        const now  = <u32>currentTimeSec();
        const id   = this.policiesTable.availablePrimaryKey;
        this.policiesTable.store(
            new Policy(
                id, holder, policy_type, coverage.amount, premium.amount,
                2_592_000,  // 30-day period
                PSTAT_ACTIVE, now, now + term_secs, now + 2_592_000,
                premium.amount, 0
            ),
            holder
        );
    }

    // ── paypremium ────────────────────────────────────────────────────────────
    @action("paypremium")
    paypremium(holder: Name, policy_id: u64): void {
        requireAuth(holder);

        const cfg    = this.getConfig();
        check(!cfg.paused, "contract is paused");
        const policy = this.policiesTable.requireGet(policy_id, "policy not found");
        check(policy.holder  == holder,       "not your policy");
        check(policy.status  == PSTAT_ACTIVE, "policy is not active");

        const now = <u32>currentTimeSec();
        check(now >= policy.next_due - 86_400, "premium not due yet (within 1 day grace)");

        // Expire if overdue by more than a grace period (7 days)
        if (now > policy.next_due + 604_800) {
            policy.status = PSTAT_EXPIRED;
            this.policiesTable.update(policy, holder);
            check(false, "policy has expired due to missed premium");
        }

        const sym = Symbol.fromU64(cfg.token_symbol_raw);
        sendTransfer(cfg.token_contract, holder, this.receiver, new Asset(policy.premium, sym), "premium payment");

        policy.next_due   += policy.period_secs;
        policy.total_paid += policy.premium;
        this.policiesTable.update(policy, holder);

        this.updatePool(policy.premium, 0, 0, cfg);
    }

    // ── fileclaim ─────────────────────────────────────────────────────────────
    @action("fileclaim")
    fileclaim(
        claimant:    Name,
        policy_id:   u64,
        amount:      Asset,
        description: string,
        evidence:    string
    ): void {
        requireAuth(claimant);

        const cfg    = this.getConfig();
        check(!cfg.paused,            "contract is paused");
        const policy = this.policiesTable.requireGet(policy_id, "policy not found");
        check(policy.holder == claimant,     "not your policy");
        check(policy.status == PSTAT_ACTIVE, "policy is not active");
        check(amount.isValid() && amount.amount > 0, "invalid claim amount");
        check(amount.amount <= policy.coverage,      "claim exceeds coverage limit");
        check(amount.symbol.value == cfg.token_symbol_raw, "wrong symbol");
        check(description.length > 0,        "description required");
        check(evidence.length > 0,           "evidence reference required");

        const id = this.claimsTable.availablePrimaryKey;
        this.claimsTable.store(
            new Claim(id, policy_id, claimant, amount.amount, description, evidence,
                      CSTAT_FILED, <u32>currentTimeSec(), 0, ""),
            claimant
        );

        policy.active_claims += 1;
        this.policiesTable.update(policy, this.receiver);

        const pool             = this.getPool();
        pool.pending_claims   += amount.amount;
        this.poolTable.set(pool, this.receiver);
    }

    // ── reviewclaim ───────────────────────────────────────────────────────────
    @action("reviewclaim")
    reviewclaim(claim_id: u64): void {
        const cfg   = this.getConfig();
        requireAuth(cfg.admin);
        const claim = this.claimsTable.requireGet(claim_id, "claim not found");
        check(claim.status == CSTAT_FILED, "claim is not in filed status");
        claim.status = CSTAT_REVIEWING;
        this.claimsTable.update(claim, this.receiver);
    }

    // ── processclaim ──────────────────────────────────────────────────────────
    @action("processclaim")
    processclaim(claim_id: u64, approve: bool, reject_reason: string): void {
        const cfg   = this.getConfig();
        requireAuth(cfg.admin);
        const claim = this.claimsTable.requireGet(claim_id, "claim not found");
        check(
            claim.status == CSTAT_FILED || claim.status == CSTAT_REVIEWING,
            "claim cannot be processed in current status"
        );

        const now  = <u32>currentTimeSec();
        const pool = this.getPool();

        if (approve) {
            check(claim.amount <= pool.total_premiums + pool.reserve - pool.total_payouts,
                  "insufficient pool funds");

            const policy = this.policiesTable.requireGet(claim.policy_id, "policy not found");
            const sym    = Symbol.fromU64(cfg.token_symbol_raw);

            sendTransfer(cfg.token_contract, this.receiver, claim.claimant,
                         new Asset(claim.amount, sym), "insurance claim payout");

            pool.total_payouts  += claim.amount;
            pool.pending_claims  = pool.pending_claims > claim.amount
                ? pool.pending_claims - claim.amount : 0;

            claim.status      = CSTAT_PAID;
            claim.resolved_at = now;

            policy.active_claims = policy.active_claims > 0 ? policy.active_claims - 1 : 0;
            this.policiesTable.update(policy, this.receiver);
        } else {
            check(reject_reason.length > 0, "reject reason required");
            claim.status        = CSTAT_REJECTED;
            claim.resolved_at   = now;
            claim.reject_reason = reject_reason;

            pool.pending_claims = pool.pending_claims > claim.amount
                ? pool.pending_claims - claim.amount : 0;

            const policy = this.policiesTable.requireGet(claim.policy_id, "policy not found");
            policy.active_claims = policy.active_claims > 0 ? policy.active_claims - 1 : 0;
            this.policiesTable.update(policy, this.receiver);
        }

        this.claimsTable.update(claim, this.receiver);
        this.poolTable.set(pool, this.receiver);
    }

    // ── cancelpolicy ──────────────────────────────────────────────────────────
    @action("cancelpolicy")
    cancelpolicy(holder: Name, policy_id: u64): void {
        requireAuth(holder);
        const policy = this.policiesTable.requireGet(policy_id, "policy not found");
        check(policy.holder == holder,        "not your policy");
        check(policy.status == PSTAT_ACTIVE,  "policy is not active");
        check(policy.active_claims == 0,      "cannot cancel with pending claims");
        policy.status = PSTAT_CANCELLED;
        this.policiesTable.update(policy, holder);
    }

    // ── addreserve ────────────────────────────────────────────────────────────
    @action("addreserve")
    addreserve(from: Name, amount: Asset): void {
        requireAuth(from);
        const cfg = this.getConfig();
        check(from == cfg.admin, "only admin can add reserves");
        check(amount.isValid() && amount.amount > 0, "invalid amount");
        check(amount.symbol.value == cfg.token_symbol_raw, "wrong symbol");

        sendTransfer(cfg.token_contract, from, this.receiver, amount, "reserve deposit");
        this.updatePool(0, amount.amount, 0, cfg);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    updatePool(premium: i64, reserve: i64, payout: i64, cfg: Config): void {
        const pool             = this.getPool();
        pool.total_premiums   += premium;
        pool.reserve          += reserve;
        pool.total_payouts    += payout;
        this.poolTable.set(pool, this.receiver);
    }

    getConfig(): Config {
        let cfg = this.configTable.get(0);
        if (!cfg) {
            cfg = new Config();
            cfg.admin = this.receiver;
            this.configTable.store(cfg, this.receiver);
        }
        return cfg;
    }

    getPool(): InsurancePool {
        let pool = this.poolTable.get(0);
        if (!pool) {
            pool = new InsurancePool();
            this.poolTable.store(pool, this.receiver);
        }
        return pool;
    }
}
