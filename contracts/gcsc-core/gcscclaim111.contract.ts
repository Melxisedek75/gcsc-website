/**
 * gcscclaim111 - GCSC ClaimBridge emergency advance gate
 *
 * Demo/MVP coordination contract for homeowner emergency advance requests
 * against an expected insurance claim payout. This contract intentionally does
 * not assign benefits, contact insurers, transfer funds, route claim proceeds,
 * or activate live claim financing.
 */
import {
    Contract, Table, TableStore, Name, Asset,
    check, requireAuth, isAccount, currentTimeSec,
    EMPTY_NAME
} from "proton-tsc";

const STATE_DISABLED:     u8 = 0;
const STATE_DEMO_ALLOWED: u8 = 1;
const STATE_BLOCKED:      u8 = 2;

const CLAIM_PENDING:  u8 = 0;
const CLAIM_APPROVED: u8 = 1;
const CLAIM_REJECTED: u8 = 2;

@table("config")
class Config extends Table {
    constructor(
        public admin:            Name = EMPTY_NAME,
        public paused:           bool = false,
        public max_advance_bps:  u32  = 2000
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

@table("states")
class StateGate extends Table {
    constructor(
        public id:                u64    = 0,
        public state_code:        string = "",
        public status:            u8     = STATE_DISABLED,
        public legal_review_hash: string = "",
        public updated_at:        u32    = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }
}

@table("claims")
class ClaimAdvance extends Table {
    constructor(
        public id:                u64    = 0,
        public homeowner:         Name   = EMPTY_NAME,
        public state_code:        string = "",
        public incident_type:     string = "",
        public estimated_payout:  Asset  = new Asset(),
        public risk_limit:        Asset  = new Asset(),
        public requested_amount:  Asset  = new Asset(),
        public approved_amount:   Asset  = new Asset(),
        public status:            u8     = CLAIM_PENDING,
        public policy_hash:       string = "",
        public incident_hash:     string = "",
        public admin_note_hash:   string = "",
        public created_at:        u32    = 0,
        public updated_at:        u32    = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_homeowner(): u64 { return this.homeowner.N; }
    set by_homeowner(v: u64) { this.homeowner = new Name(v); }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }
}

@contract
class gcscclaim111 extends Contract {

    configTable: TableStore<Config>       = new TableStore<Config>(this.receiver);
    statesTable: TableStore<StateGate>    = new TableStore<StateGate>(this.receiver);
    claimsTable: TableStore<ClaimAdvance> = new TableStore<ClaimAdvance>(this.receiver);

    @action("setconfig")
    setconfig(admin: Name, paused: bool, max_advance_bps: u32): void {
        check(isAccount(admin), "admin does not exist");
        check(max_advance_bps > 0 && max_advance_bps <= 10000, "invalid max advance bps");

        let cfg = this.configTable.get(0);
        if (!cfg) {
            requireAuth(this.receiver);
            cfg = new Config(admin, paused, max_advance_bps);
            this.configTable.store(cfg, this.receiver);
            return;
        }

        requireAuth(cfg.admin == EMPTY_NAME ? this.receiver : cfg.admin);
        cfg.admin = admin;
        cfg.paused = paused;
        cfg.max_advance_bps = max_advance_bps;
        this.configTable.update(cfg, this.receiver);
    }

    @action("setstate")
    setstate(state_code: string, status: u8, legal_review_hash: string): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(!cfg.paused, "contract is paused");
        this.checkStateCode(state_code);
        check(status <= STATE_BLOCKED, "invalid state status");
        check(legal_review_hash.length > 0, "legal review hash required");

        const key = this.stateKey(state_code);
        let row = this.statesTable.get(key);
        if (!row) {
            row = new StateGate(key, state_code, status, legal_review_hash, <u32>currentTimeSec());
            this.statesTable.store(row, cfg.admin);
            return;
        }

        row.status = status;
        row.legal_review_hash = legal_review_hash;
        row.updated_at = <u32>currentTimeSec();
        this.statesTable.update(row, cfg.admin);
    }

    @action("requestclaim")
    requestclaim(
        homeowner:         Name,
        state_code:        string,
        incident_type:     string,
        estimated_payout:  Asset,
        risk_limit:        Asset,
        requested_amount:  Asset,
        policy_hash:       string,
        incident_hash:     string
    ): void {
        requireAuth(homeowner);

        const cfg = this.getConfig();
        check(!cfg.paused, "contract is paused");
        check(isAccount(homeowner), "homeowner does not exist");
        this.checkStateEnabled(state_code);
        this.checkAssetSet(estimated_payout, risk_limit, requested_amount);
        check(incident_type.length > 0, "incident type required");
        check(policy_hash.length > 0, "policy hash required");
        check(incident_hash.length > 0, "incident hash required");

        const limit = this.demoClaimAdvanceLimit(estimated_payout, risk_limit, cfg.max_advance_bps);
        check(requested_amount.amount <= limit.amount, "requested amount exceeds demo claim advance limit");

        const zero = new Asset(0, requested_amount.symbol);
        const now = <u32>currentTimeSec();
        const id = this.claimsTable.availablePrimaryKey;

        this.claimsTable.store(
            new ClaimAdvance(
                id,
                homeowner,
                state_code,
                incident_type,
                estimated_payout,
                risk_limit,
                requested_amount,
                zero,
                CLAIM_PENDING,
                policy_hash,
                incident_hash,
                "",
                now,
                now
            ),
            homeowner
        );
    }

    @action("approveclaim")
    approveclaim(claim_id: u64, approved_amount: Asset, admin_note_hash: string): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(!cfg.paused, "contract is paused");
        check(admin_note_hash.length > 0, "admin note hash required");

        const row = this.claimsTable.requireGet(claim_id, "claim request not found");
        check(row.status == CLAIM_PENDING, "claim request is not pending");
        check(approved_amount.isValid() && approved_amount.amount > 0, "invalid approved amount");
        check(approved_amount.symbol.value == row.requested_amount.symbol.value, "wrong approved symbol");
        check(approved_amount.amount <= row.requested_amount.amount, "approved amount exceeds request");

        const limit = this.demoClaimAdvanceLimit(row.estimated_payout, row.risk_limit, cfg.max_advance_bps);
        check(approved_amount.amount <= limit.amount, "approved amount exceeds demo claim advance limit");

        row.approved_amount = approved_amount;
        row.status = CLAIM_APPROVED;
        row.admin_note_hash = admin_note_hash;
        row.updated_at = <u32>currentTimeSec();
        this.claimsTable.update(row, cfg.admin);
    }

    @action("rejectclaim")
    rejectclaim(claim_id: u64, admin_note_hash: string): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(!cfg.paused, "contract is paused");
        check(admin_note_hash.length > 0, "admin note hash required");

        const row = this.claimsTable.requireGet(claim_id, "claim request not found");
        check(row.status == CLAIM_PENDING, "claim request is not pending");

        row.status = CLAIM_REJECTED;
        row.admin_note_hash = admin_note_hash;
        row.updated_at = <u32>currentTimeSec();
        this.claimsTable.update(row, cfg.admin);
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

    checkStateCode(state_code: string): void {
        check(state_code.length == 2, "state code must be two letters");
    }

    stateKey(state_code: string): u64 {
        this.checkStateCode(state_code);
        return (<u64>state_code.charCodeAt(0) << 8) | <u64>state_code.charCodeAt(1);
    }

    checkStateEnabled(state_code: string): void {
        const gate = this.statesTable.get(this.stateKey(state_code));
        check(gate != null && gate.status == STATE_DEMO_ALLOWED, "state is not enabled for demo claim advance requests");
    }

    checkAssetSet(estimated_payout: Asset, risk_limit: Asset, requested_amount: Asset): void {
        check(estimated_payout.isValid() && estimated_payout.amount > 0, "invalid estimated payout");
        check(risk_limit.isValid() && risk_limit.amount > 0, "invalid risk limit");
        check(requested_amount.isValid() && requested_amount.amount > 0, "invalid requested amount");
        check(risk_limit.symbol.value == estimated_payout.symbol.value, "risk limit symbol mismatch");
        check(requested_amount.symbol.value == estimated_payout.symbol.value, "requested symbol mismatch");
    }

    demoClaimAdvanceLimit(estimated_payout: Asset, risk_limit: Asset, max_advance_bps: u32): Asset {
        const payoutLimit = estimated_payout.amount * <i64>max_advance_bps / 10000;
        const limit = payoutLimit < risk_limit.amount ? payoutLimit : risk_limit.amount;
        return new Asset(limit, estimated_payout.symbol);
    }
}
