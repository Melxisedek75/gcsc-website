/**
 * gcsclead1111 – GCSC Leadership & Governance Contract
 *
 * Board leaders propose and vote on actions.
 * Proposal types: 0 = TEXT | 1 = TREASURY_SPEND | 2 = PARAMETER_CHANGE
 * Proposal status: 0 = PENDING | 1 = APPROVED | 2 = REJECTED | 3 = EXECUTED | 4 = CANCELLED
 */
import {
    Contract, Table, TableStore, Name, Asset, Symbol,
    check, requireAuth, isAccount, currentTimeSec,
    EMPTY_NAME, ActionData, InlineAction, PermissionLevel
} from "proton-tsc";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROP_TEXT:      u8 = 0;
const PROP_TREASURY:  u8 = 1;
const PROP_PARAM:     u8 = 2;

const STATUS_PENDING:   u8 = 0;
const STATUS_APPROVED:  u8 = 1;
const STATUS_REJECTED:  u8 = 2;
const STATUS_EXECUTED:  u8 = 3;
const STATUS_CANCELLED: u8 = 4;

// ─── Tables ───────────────────────────────────────────────────────────────────

@table("leaders")
class Leader extends Table {
    constructor(
        public account:    Name   = EMPTY_NAME,
        public title:      string = "",
        public added_date: u32    = 0,
        public active:     bool   = true
    ) { super(); }

    @primary
    get primary(): u64 { return this.account.N; }
}

@table("proposals")
class Proposal extends Table {
    constructor(
        public id:           u64    = 0,
        public proposer:     Name   = EMPTY_NAME,
        public prop_type:    u8     = PROP_TEXT,
        public title:        string = "",
        public description:  string = "",
        public payload:      string = "",   // JSON payload for treasury/param proposals
        public status:       u8     = STATUS_PENDING,
        public yes_votes:    u32    = 0,
        public no_votes:     u32    = 0,
        public created_at:   u32    = 0,
        public expires_at:   u32    = 0,
        public executed_at:  u32    = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_proposer(): u64 { return this.proposer.N; }
    set by_proposer(v: u64) { this.proposer = new Name(v); }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }
}

@table("votes")
class Vote extends Table {
    constructor(
        public id:          u64  = 0,
        public proposal_id: u64  = 0,
        public voter:       Name = EMPTY_NAME,
        public approve:     bool = false,
        public voted_at:    u32  = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_prop(): u64 { return this.proposal_id; }
    set by_prop(v: u64) { this.proposal_id = v; }

    @secondary
    get by_voter(): u64 { return this.voter.N; }
    set by_voter(v: u64) { this.voter = new Name(v); }
}

@table("config")
class Config extends Table {
    constructor(
        public admin:              Name = EMPTY_NAME,
        public quorum:             u32  = 2,          // min votes to pass
        public approval_threshold: u32  = 51,         // percent
        public voting_period:      u32  = 604_800,    // 7 days in seconds
        public total_leaders:      u32  = 0
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

// ─── Contract ─────────────────────────────────────────────────────────────────

@contract
class gcsclead1111 extends Contract {

    leadersTable:   TableStore<Leader>   = new TableStore<Leader>(this.receiver);
    proposalsTable: TableStore<Proposal> = new TableStore<Proposal>(this.receiver);
    votesTable:     TableStore<Vote>     = new TableStore<Vote>(this.receiver);
    configTable:    TableStore<Config>   = new TableStore<Config>(this.receiver);

    // ── setconfig ─────────────────────────────────────────────────────────────
    @action("setconfig")
    setconfig(admin: Name, quorum: u32, approval_threshold: u32, voting_period: u32): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin == EMPTY_NAME ? this.receiver : cfg.admin);

        check(isAccount(admin),            "admin account does not exist");
        check(quorum > 0,                  "quorum must be positive");
        check(approval_threshold > 0 && approval_threshold <= 100, "threshold must be 1-100");
        check(voting_period >= 3_600,      "voting period must be at least 1 hour");

        cfg.admin              = admin;
        cfg.quorum             = quorum;
        cfg.approval_threshold = approval_threshold;
        cfg.voting_period      = voting_period;
        this.configTable.set(cfg, this.receiver);
    }

    // ── addleader ─────────────────────────────────────────────────────────────
    @action("addleader")
    addleader(account: Name, title: string): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);

        check(isAccount(account),                  "account does not exist");
        check(title.length > 0,                    "title required");
        check(!this.leadersTable.exists(account.N), "already a leader");

        this.leadersTable.store(
            new Leader(account, title, <u32>currentTimeSec(), true),
            this.receiver
        );

        cfg.total_leaders += 1;
        this.configTable.set(cfg, this.receiver);
    }

    // ── removeleader ──────────────────────────────────────────────────────────
    @action("removeleader")
    removeleader(account: Name): void {
        const cfg    = this.getConfig();
        requireAuth(cfg.admin);
        const leader = this.leadersTable.requireGet(account.N, "leader not found");
        this.leadersTable.remove(leader);
        cfg.total_leaders = cfg.total_leaders > 0 ? cfg.total_leaders - 1 : 0;
        this.configTable.set(cfg, this.receiver);
    }

    // ── propose ───────────────────────────────────────────────────────────────
    @action("propose")
    propose(
        proposer:    Name,
        prop_type:   u8,
        title:       string,
        description: string,
        payload:     string
    ): void {
        requireAuth(proposer);
        this.leadersTable.requireGet(proposer.N, "proposer is not a leader");

        check(prop_type <= PROP_PARAM, "invalid proposal type");
        check(title.length > 0,        "title required");
        check(description.length > 0,  "description required");

        const cfg = this.getConfig();
        const id  = this.proposalsTable.availablePrimaryKey;
        const now = <u32>currentTimeSec();

        this.proposalsTable.store(
            new Proposal(
                id, proposer, prop_type, title, description, payload,
                STATUS_PENDING, 0, 0, now, now + cfg.voting_period, 0
            ),
            proposer
        );
    }

    // ── vote ──────────────────────────────────────────────────────────────────
    @action("vote")
    vote(voter: Name, proposal_id: u64, approve: bool): void {
        requireAuth(voter);
        this.leadersTable.requireGet(voter.N, "voter is not a leader");

        const prop = this.proposalsTable.requireGet(proposal_id, "proposal not found");
        check(prop.status == STATUS_PENDING,        "proposal is not open for voting");
        check(<u32>currentTimeSec() < prop.expires_at, "voting period has ended");

        // prevent double vote
        let existingVote = this.votesTable.getBySecondaryU64(proposal_id, 0);
        while (existingVote) {
            if (existingVote.voter == voter) {
                check(false, "already voted on this proposal");
            }
            existingVote = this.votesTable.next(existingVote);
        }

        const voteId = this.votesTable.availablePrimaryKey;
        this.votesTable.store(
            new Vote(voteId, proposal_id, voter, approve, <u32>currentTimeSec()),
            voter
        );

        if (approve) {
            prop.yes_votes += 1;
        } else {
            prop.no_votes  += 1;
        }

        const cfg        = this.getConfig();
        const totalVotes = prop.yes_votes + prop.no_votes;

        if (totalVotes >= cfg.quorum) {
            const pct = (prop.yes_votes * 100) / totalVotes;
            if (pct >= cfg.approval_threshold) {
                prop.status = STATUS_APPROVED;
            } else {
                prop.status = STATUS_REJECTED;
            }
        }
        this.proposalsTable.update(prop, this.receiver);
    }

    // ── execute ───────────────────────────────────────────────────────────────
    @action("execute")
    execute(executor: Name, proposal_id: u64): void {
        requireAuth(executor);
        this.leadersTable.requireGet(executor.N, "executor is not a leader");

        const prop = this.proposalsTable.requireGet(proposal_id, "proposal not found");
        check(prop.status == STATUS_APPROVED, "proposal is not approved");

        prop.status      = STATUS_EXECUTED;
        prop.executed_at = <u32>currentTimeSec();
        this.proposalsTable.update(prop, this.receiver);
        // Downstream contracts should listen to on-chain state for execution.
    }

    // ── cancel ────────────────────────────────────────────────────────────────
    @action("cancel")
    cancel(proposal_id: u64): void {
        const prop = this.proposalsTable.requireGet(proposal_id, "proposal not found");
        requireAuth(prop.proposer);
        check(prop.status == STATUS_PENDING, "can only cancel pending proposals");
        prop.status = STATUS_CANCELLED;
        this.proposalsTable.update(prop, this.receiver);
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
