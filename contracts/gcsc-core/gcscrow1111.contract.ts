/**
 * gcscrow1111 - GCSC milestone escrow contract
 *
 * Homeowners create construction escrows, fund them by transferring tokens to
 * this contract with memo equal to project_id, then approve and release
 * contractor milestone payments.
 */
import {
    Contract, Table, TableStore, Name, Asset, Symbol,
    check, requireAuth, isAccount, currentTimeSec,
    EMPTY_NAME, ActionData, InlineAction, PermissionLevel
} from "proton-tsc";

// Inline transfer helper

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

// Constants

const TOKEN_CONTRACT: Name = Name.fromString("gcsctoken111");

const ESCROW_DRAFT:     u8 = 0;
const ESCROW_FUNDED:    u8 = 1;
const ESCROW_ACTIVE:    u8 = 2;
const ESCROW_DISPUTED:  u8 = 3;
const ESCROW_COMPLETED: u8 = 4;
const ESCROW_CANCELLED: u8 = 5;

const MS_PENDING:   u8 = 0;
const MS_SUBMITTED: u8 = 1;
const MS_APPROVED:  u8 = 2;
const MS_RELEASED:  u8 = 3;
const MS_DISPUTED:  u8 = 4;

// Tables

@table("config")
class Config extends Table {
    constructor(
        public admin:  Name = EMPTY_NAME,
        public paused: bool = false
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

@table("escrows")
class Escrow extends Table {
    constructor(
        public id:              u64    = 0,
        public project_id:      string = "",
        public homeowner:       Name   = EMPTY_NAME,
        public contractor:      Name   = EMPTY_NAME,
        public total_amount:    Asset  = new Asset(),
        public funded_amount:   Asset  = new Asset(),
        public released_amount: Asset  = new Asset(),
        public status:          u8     = ESCROW_DRAFT,
        public created_at:      u32    = 0,
        public updated_at:      u32    = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_homeowner(): u64 { return this.homeowner.N; }
    set by_homeowner(v: u64) { this.homeowner = new Name(v); }

    @secondary
    get by_contractor(): u64 { return this.contractor.N; }
    set by_contractor(v: u64) { this.contractor = new Name(v); }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }
}

@table("milestones")
class Milestone extends Table {
    constructor(
        public id:             u64    = 0,
        public escrow_id:      u64    = 0,
        public sequence_num:   u32    = 0,
        public amount:         Asset  = new Asset(),
        public work_status:    u8     = MS_PENDING,
        public payment_status: u8     = MS_PENDING,
        public evidence_hash:  string = "",
        public submitted_at:   u32    = 0,
        public approved_at:    u32    = 0,
        public released_at:    u32    = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_escrow(): u64 { return this.escrow_id; }
    set by_escrow(v: u64) { this.escrow_id = v; }
}

// Contract

@contract
class gcscrow1111 extends Contract {

    configTable:     TableStore<Config>    = new TableStore<Config>(this.receiver);
    escrowsTable:    TableStore<Escrow>    = new TableStore<Escrow>(this.receiver);
    milestonesTable: TableStore<Milestone> = new TableStore<Milestone>(this.receiver);

    @action("setconfig")
    setconfig(admin: Name, paused: bool): void {
        check(isAccount(admin), "admin does not exist");

        let cfg = this.configTable.get(0);
        if (!cfg) {
            requireAuth(this.receiver);
            cfg = new Config(admin, paused);
            this.configTable.store(cfg, this.receiver);
            return;
        }

        requireAuth(cfg.admin == EMPTY_NAME ? this.receiver : cfg.admin);
        cfg.admin  = admin;
        cfg.paused = paused;
        this.configTable.update(cfg, this.receiver);
    }

    @action("createescrow")
    createescrow(project_id: string, homeowner: Name, contractor: Name, total_amount: Asset): void {
        requireAuth(homeowner);

        const cfg = this.getConfig();
        check(!cfg.paused, "contract is paused");
        check(project_id.length > 0, "project id required");
        check(isAccount(homeowner), "homeowner does not exist");
        check(isAccount(contractor), "contractor does not exist");
        check(homeowner != contractor, "homeowner and contractor must differ");
        check(total_amount.isValid() && total_amount.amount > 0, "invalid total amount");

        const zero = new Asset(0, Symbol.fromU64(total_amount.symbol.value));
        const now  = <u32>currentTimeSec();
        const id   = this.escrowsTable.availablePrimaryKey;

        this.escrowsTable.store(
            new Escrow(
                id, project_id, homeowner, contractor, total_amount, zero, zero,
                ESCROW_DRAFT, now, now
            ),
            homeowner
        );
    }

    @action("addmilestone")
    addmilestone(escrow_id: u64, sequence_num: u32, amount: Asset): void {
        const cfg = this.getConfig();
        check(!cfg.paused, "contract is paused");

        const escrow = this.escrowsTable.requireGet(escrow_id, "escrow not found");
        requireAuth(escrow.homeowner);
        check(escrow.status == ESCROW_DRAFT, "escrow must be draft");
        check(amount.isValid() && amount.amount > 0, "invalid milestone amount");
        check(amount.symbol.value == escrow.total_amount.symbol.value, "wrong milestone symbol");
        this.checkEscrowAmounts(escrow);

        const milestoneTotal = this.sumMilestones(escrow_id, amount.symbol.value);
        check(milestoneTotal + amount.amount <= escrow.total_amount.amount, "milestones exceed escrow total");

        const id = this.milestonesTable.availablePrimaryKey;
        this.milestonesTable.store(
            new Milestone(id, escrow_id, sequence_num, amount),
            escrow.homeowner
        );
    }

    @action("transfer", notify)
    transfer(from: Name, to: Name, quantity: Asset, memo: string): void {
        if (to != this.receiver || from == this.receiver) {
            return;
        }

        const cfg = this.getConfig();
        check(!cfg.paused, "contract is paused");
        check(this.firstReceiver == TOKEN_CONTRACT, "unsupported token contract");
        check(quantity.isValid() && quantity.amount > 0, "invalid funding amount");

        const escrow = this.requireFundingEscrow(from, quantity, memo);
        check(escrow.status == ESCROW_DRAFT, "escrow is not in draft status");
        check(quantity.symbol.value == escrow.total_amount.symbol.value, "wrong funding symbol");
        check(escrow.funded_amount.amount + quantity.amount == escrow.total_amount.amount, "incorrect funding amount");

        escrow.funded_amount = Asset.add(escrow.funded_amount, quantity);
        check(escrow.funded_amount.amount <= escrow.total_amount.amount, "funded amount exceeds total amount");

        escrow.status     = ESCROW_FUNDED;
        escrow.status     = ESCROW_ACTIVE;
        escrow.updated_at = <u32>currentTimeSec();
        this.checkEscrowAmounts(escrow);
        this.escrowsTable.update(escrow, this.receiver);
    }

    @action("submitms")
    submitmilestone(escrow_id: u64, milestone_id: u64, evidence_hash: string): void {
        const cfg = this.getConfig();
        check(!cfg.paused, "contract is paused");

        const escrow = this.escrowsTable.requireGet(escrow_id, "escrow not found");
        requireAuth(escrow.contractor);
        check(escrow.status == ESCROW_ACTIVE, "escrow is not active");
        check(evidence_hash.length > 0, "evidence hash required");
        this.checkEscrowAmounts(escrow);

        const milestone = this.requireMilestone(escrow_id, milestone_id);
        check(milestone.work_status == MS_PENDING, "milestone is not pending");
        check(milestone.payment_status == MS_PENDING, "milestone payment is not pending");

        milestone.work_status   = MS_SUBMITTED;
        milestone.evidence_hash = evidence_hash;
        milestone.submitted_at  = <u32>currentTimeSec();
        this.milestonesTable.update(milestone, escrow.contractor);
    }

    @action("approvems")
    approvemilestone(escrow_id: u64, milestone_id: u64): void {
        const cfg = this.getConfig();
        check(!cfg.paused, "contract is paused");

        const escrow = this.escrowsTable.requireGet(escrow_id, "escrow not found");
        requireAuth(escrow.homeowner);
        check(escrow.status == ESCROW_ACTIVE, "escrow is not active");
        this.checkEscrowAmounts(escrow);

        const milestone = this.requireMilestone(escrow_id, milestone_id);
        check(milestone.work_status == MS_SUBMITTED, "milestone is not submitted");
        check(milestone.payment_status == MS_PENDING, "milestone payment is not pending");

        milestone.work_status    = MS_APPROVED;
        milestone.payment_status = MS_APPROVED;
        milestone.approved_at    = <u32>currentTimeSec();
        this.milestonesTable.update(milestone, escrow.homeowner);
    }

    @action("releasems")
    releasemilestone(escrow_id: u64, milestone_id: u64): void {
        const cfg = this.getConfig();
        check(!cfg.paused, "contract is paused");

        const escrow = this.escrowsTable.requireGet(escrow_id, "escrow not found");
        requireAuth(escrow.homeowner);
        check(escrow.status == ESCROW_ACTIVE, "escrow is not active");
        check(escrow.status != ESCROW_DISPUTED, "escrow is disputed");
        this.checkEscrowAmounts(escrow);

        const milestone = this.requireMilestone(escrow_id, milestone_id);
        check(milestone.work_status == MS_APPROVED, "milestone is not approved");
        check(milestone.payment_status == MS_APPROVED, "milestone payment is not approved");
        check(milestone.work_status != MS_DISPUTED, "milestone is disputed");
        check(milestone.amount.amount <= escrow.funded_amount.amount - escrow.released_amount.amount,
              "insufficient funded balance");

        sendTransfer(TOKEN_CONTRACT, this.receiver, escrow.contractor, milestone.amount, "escrow milestone release");

        milestone.work_status    = MS_RELEASED;
        milestone.payment_status = MS_RELEASED;
        milestone.released_at    = <u32>currentTimeSec();
        this.milestonesTable.update(milestone, this.receiver);

        escrow.released_amount = Asset.add(escrow.released_amount, milestone.amount);
        check(escrow.released_amount.amount <= escrow.funded_amount.amount, "released amount exceeds funded amount");

        if (escrow.released_amount.amount == escrow.total_amount.amount) {
            escrow.status = ESCROW_COMPLETED;
        }
        escrow.updated_at = <u32>currentTimeSec();
        this.checkEscrowAmounts(escrow);
        this.escrowsTable.update(escrow, this.receiver);
    }

    @action("disputems")
    disputemilestone(actor: Name, escrow_id: u64, milestone_id: u64): void {
        requireAuth(actor);

        const cfg = this.getConfig();
        check(!cfg.paused, "contract is paused");

        const escrow = this.escrowsTable.requireGet(escrow_id, "escrow not found");
        check(actor == escrow.homeowner || actor == escrow.contractor, "actor is not escrow party");
        check(escrow.status == ESCROW_ACTIVE, "escrow is not active");
        this.checkEscrowAmounts(escrow);

        const milestone = this.requireMilestone(escrow_id, milestone_id);
        check(milestone.work_status != MS_RELEASED, "released milestone cannot be disputed");

        milestone.work_status    = MS_DISPUTED;
        milestone.payment_status = MS_DISPUTED;
        this.milestonesTable.update(milestone, actor);

        escrow.status     = ESCROW_DISPUTED;
        escrow.updated_at = <u32>currentTimeSec();
        this.escrowsTable.update(escrow, this.receiver);
    }

    @action("cancelescrow")
    cancelescrow(escrow_id: u64): void {
        const cfg = this.getConfig();
        check(!cfg.paused, "contract is paused");

        const escrow = this.escrowsTable.requireGet(escrow_id, "escrow not found");
        requireAuth(escrow.homeowner);
        check(escrow.status == ESCROW_DRAFT, "can only cancel draft escrow");
        this.checkEscrowAmounts(escrow);

        escrow.status     = ESCROW_CANCELLED;
        escrow.updated_at = <u32>currentTimeSec();
        this.escrowsTable.update(escrow, escrow.homeowner);
    }

    // Helpers

    getConfig(): Config {
        let cfg = this.configTable.get(0);
        if (!cfg) {
            cfg = new Config();
            cfg.admin = this.receiver;
            this.configTable.store(cfg, this.receiver);
        }
        return cfg;
    }

    requireMilestone(escrow_id: u64, milestone_id: u64): Milestone {
        const milestone = this.milestonesTable.requireGet(milestone_id, "milestone not found");
        check(milestone.escrow_id == escrow_id, "milestone does not belong to escrow");
        return milestone;
    }

    sumMilestones(escrow_id: u64, symbol_raw: u64): i64 {
        let total: i64 = 0;
        let row = this.milestonesTable.getBySecondaryU64(escrow_id, 0);
        while (row && row.escrow_id == escrow_id) {
            check(row.amount.symbol.value == symbol_raw, "milestone symbol mismatch");
            total += row.amount.amount;
            row = this.milestonesTable.nextBySecondaryU64(row, 0);
        }
        return total;
    }

    requireFundingEscrow(homeowner: Name, quantity: Asset, project_id: string): Escrow {
        let row = this.escrowsTable.first();
        while (row) {
            if (
                row.homeowner == homeowner &&
                row.project_id == project_id &&
                row.status == ESCROW_DRAFT &&
                row.total_amount.symbol.value == quantity.symbol.value
            ) {
                return row;
            }
            row = this.escrowsTable.next(row);
        }
        check(false, "matching draft escrow not found; memo must equal project_id");
        return new Escrow();
    }

    checkEscrowAmounts(escrow: Escrow): void {
        check(escrow.total_amount.symbol.value == escrow.funded_amount.symbol.value, "funded symbol mismatch");
        check(escrow.total_amount.symbol.value == escrow.released_amount.symbol.value, "released symbol mismatch");
        check(escrow.funded_amount.amount <= escrow.total_amount.amount, "funded amount exceeds total amount");
        check(escrow.released_amount.amount <= escrow.funded_amount.amount, "released amount exceeds funded amount");
    }
}
