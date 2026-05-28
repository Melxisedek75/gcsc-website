/**
 * gcscworkcap1 - GCSC contract-backed working capital gate
 *
 * Demo/MVP coordination contract for contractor working capital requests
 * against a verified construction contract. This contract intentionally does
 * not transfer funds, route repayments, assign payment rights, or activate
 * live lending.
 */
import {
    Contract, Table, TableStore, Name, Asset,
    check, requireAuth, isAccount, currentTimeSec,
    EMPTY_NAME
} from "proton-tsc";

const STATE_DISABLED:     u8 = 0;
const STATE_DEMO_ALLOWED: u8 = 1;
const STATE_BLOCKED:      u8 = 2;

const REQUEST_PENDING:  u8 = 0;
const REQUEST_APPROVED: u8 = 1;
const REQUEST_REJECTED: u8 = 2;

@table("config")
class Config extends Table {
    constructor(
        public admin:           Name = EMPTY_NAME,
        public paused:          bool = false,
        public max_advance_bps: u32  = 2000
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

@table("verified")
class VerifiedContractor extends Table {
    constructor(
        public contractor:        Name   = EMPTY_NAME,
        public verified:          bool   = false,
        public verification_hash: string = "",
        public updated_at:        u32    = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.contractor.N; }
}

@table("workcaps")
class WorkcapRequest extends Table {
    constructor(
        public id:               u64    = 0,
        public contractor:       Name   = EMPTY_NAME,
        public state_code:       string = "",
        public contract_amount:  Asset  = new Asset(),
        public risk_limit:       Asset  = new Asset(),
        public requested_amount: Asset  = new Asset(),
        public approved_amount:  Asset  = new Asset(),
        public status:           u8     = REQUEST_PENDING,
        public contract_hash:    string = "",
        public scope_hash:       string = "",
        public admin_note_hash:  string = "",
        public created_at:       u32    = 0,
        public updated_at:       u32    = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_contractor(): u64 { return this.contractor.N; }
    set by_contractor(v: u64) { this.contractor = new Name(v); }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }
}

@contract
class gcscworkcap1 extends Contract {

    configTable:   TableStore<Config>             = new TableStore<Config>(this.receiver);
    statesTable:   TableStore<StateGate>          = new TableStore<StateGate>(this.receiver);
    verifiedTable: TableStore<VerifiedContractor> = new TableStore<VerifiedContractor>(this.receiver);
    workcapsTable: TableStore<WorkcapRequest>     = new TableStore<WorkcapRequest>(this.receiver);

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

    @action("setverify")
    setverify(contractor: Name, verified: bool, verification_hash: string): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(!cfg.paused, "contract is paused");
        check(isAccount(contractor), "contractor does not exist");
        check(verification_hash.length > 0, "verification hash required");

        let row = this.verifiedTable.get(contractor.N);
        if (!row) {
            row = new VerifiedContractor(contractor, verified, verification_hash, <u32>currentTimeSec());
            this.verifiedTable.store(row, cfg.admin);
            return;
        }

        row.verified = verified;
        row.verification_hash = verification_hash;
        row.updated_at = <u32>currentTimeSec();
        this.verifiedTable.update(row, cfg.admin);
    }

    @action("requestcap")
    requestcap(
        contractor:       Name,
        state_code:       string,
        contract_amount:  Asset,
        risk_limit:       Asset,
        requested_amount: Asset,
        contract_hash:    string,
        scope_hash:       string
    ): void {
        requireAuth(contractor);

        const cfg = this.getConfig();
        check(!cfg.paused, "contract is paused");
        check(isAccount(contractor), "contractor does not exist");
        this.checkStateEnabled(state_code);
        this.checkContractorVerified(contractor);
        this.checkAssetSet(contract_amount, risk_limit, requested_amount);
        check(contract_hash.length > 0, "contract hash required");
        check(scope_hash.length > 0, "scope hash required");

        const limit = this.demoWorkcapLimit(contract_amount, risk_limit, cfg.max_advance_bps);
        check(requested_amount.amount <= limit.amount, "requested amount exceeds demo working capital limit");

        const zero = new Asset(0, requested_amount.symbol);
        const now = <u32>currentTimeSec();
        const id = this.workcapsTable.availablePrimaryKey;

        this.workcapsTable.store(
            new WorkcapRequest(
                id,
                contractor,
                state_code,
                contract_amount,
                risk_limit,
                requested_amount,
                zero,
                REQUEST_PENDING,
                contract_hash,
                scope_hash,
                "",
                now,
                now
            ),
            contractor
        );
    }

    @action("approvecap")
    approvecap(request_id: u64, approved_amount: Asset, admin_note_hash: string): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(!cfg.paused, "contract is paused");
        check(admin_note_hash.length > 0, "admin note hash required");

        const row = this.workcapsTable.requireGet(request_id, "working capital request not found");
        check(row.status == REQUEST_PENDING, "working capital request is not pending");
        check(approved_amount.isValid() && approved_amount.amount > 0, "invalid approved amount");
        check(approved_amount.symbol.value == row.requested_amount.symbol.value, "wrong approved symbol");
        check(approved_amount.amount <= row.requested_amount.amount, "approved amount exceeds request");

        const limit = this.demoWorkcapLimit(row.contract_amount, row.risk_limit, cfg.max_advance_bps);
        check(approved_amount.amount <= limit.amount, "approved amount exceeds demo working capital limit");

        row.approved_amount = approved_amount;
        row.status = REQUEST_APPROVED;
        row.admin_note_hash = admin_note_hash;
        row.updated_at = <u32>currentTimeSec();
        this.workcapsTable.update(row, cfg.admin);
    }

    @action("rejectcap")
    rejectcap(request_id: u64, admin_note_hash: string): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(!cfg.paused, "contract is paused");
        check(admin_note_hash.length > 0, "admin note hash required");

        const row = this.workcapsTable.requireGet(request_id, "working capital request not found");
        check(row.status == REQUEST_PENDING, "working capital request is not pending");

        row.status = REQUEST_REJECTED;
        row.admin_note_hash = admin_note_hash;
        row.updated_at = <u32>currentTimeSec();
        this.workcapsTable.update(row, cfg.admin);
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
        check(gate != null && gate.status == STATE_DEMO_ALLOWED, "state is not enabled for demo working capital requests");
    }

    checkContractorVerified(contractor: Name): void {
        const row = this.verifiedTable.get(contractor.N);
        check(row != null && row.verified, "contractor is not verified");
    }

    checkAssetSet(contract_amount: Asset, risk_limit: Asset, requested_amount: Asset): void {
        check(contract_amount.isValid() && contract_amount.amount > 0, "invalid contract amount");
        check(risk_limit.isValid() && risk_limit.amount > 0, "invalid risk limit");
        check(requested_amount.isValid() && requested_amount.amount > 0, "invalid requested amount");
        check(risk_limit.symbol.value == contract_amount.symbol.value, "risk limit symbol mismatch");
        check(requested_amount.symbol.value == contract_amount.symbol.value, "requested symbol mismatch");
    }

    demoWorkcapLimit(contract_amount: Asset, risk_limit: Asset, max_advance_bps: u32): Asset {
        const contractLimit = contract_amount.amount * <i64>max_advance_bps / 10000;
        const limit = contractLimit < risk_limit.amount ? contractLimit : risk_limit.amount;
        return new Asset(limit, contract_amount.symbol);
    }
}
