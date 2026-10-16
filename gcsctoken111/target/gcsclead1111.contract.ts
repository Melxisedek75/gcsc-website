import * as _chain from "as-chain";
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



class LeaderDB extends _chain.MultiIndex<Leader> {

}

@table("leaders", nocodegen)

class Leader implements _chain.MultiIndexValue {
    
    constructor(
        public account:    Name   = EMPTY_NAME,
        public title:      string = "",
        public added_date: u32    = 0,
        public active:     bool   = true
    ) {  }

    @primary
    get primary(): u64 { return this.account.N; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account);
        enc.packString(this.title);
        enc.packNumber<u32>(this.added_date);
        enc.packNumber<bool>(this.active);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.account = obj;
        }
        this.title = dec.unpackString();
        this.added_date = dec.unpackNumber<u32>();
        this.active = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account.getSize();
        size += _chain.Utils.calcPackedStringLength(this.title);
        size += sizeof<u32>();
        size += sizeof<bool>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x8A8C955F00000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Leader.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Leader.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): LeaderDB {
        return new LeaderDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class ProposalDB extends _chain.MultiIndex<Proposal> {
    get by_proposerDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[0];
    }
    get by_statusDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[1];
    }

    
    updateBy_proposer(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

    
    updateBy_status(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

}

@table("proposals", nocodegen)

class Proposal implements _chain.MultiIndexValue {
    
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
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_proposer(): u64 { return this.proposer.N; }
    set by_proposer(v: u64) { this.proposer = new Name(v); }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.pack(this.proposer);
        enc.packNumber<u8>(this.prop_type);
        enc.packString(this.title);
        enc.packString(this.description);
        enc.packString(this.payload);
        enc.packNumber<u8>(this.status);
        enc.packNumber<u32>(this.yes_votes);
        enc.packNumber<u32>(this.no_votes);
        enc.packNumber<u32>(this.created_at);
        enc.packNumber<u32>(this.expires_at);
        enc.packNumber<u32>(this.executed_at);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u64>();
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.proposer = obj;
        }
        this.prop_type = dec.unpackNumber<u8>();
        this.title = dec.unpackString();
        this.description = dec.unpackString();
        this.payload = dec.unpackString();
        this.status = dec.unpackNumber<u8>();
        this.yes_votes = dec.unpackNumber<u32>();
        this.no_votes = dec.unpackNumber<u32>();
        this.created_at = dec.unpackNumber<u32>();
        this.expires_at = dec.unpackNumber<u32>();
        this.executed_at = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += this.proposer.getSize();
        size += sizeof<u8>();
        size += _chain.Utils.calcPackedStringLength(this.title);
        size += _chain.Utils.calcPackedStringLength(this.description);
        size += _chain.Utils.calcPackedStringLength(this.payload);
        size += sizeof<u8>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xADE95A60D1C00000);
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
        return Proposal.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Proposal.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        switch (i) {
            case 0: {
                return _chain.newSecondaryValue_u64(this.by_proposer);
                break;
            }
            case 1: {
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
                this.by_proposer = _value;
                break;
            }
            case 1: {
                let _value = _chain.getSecondaryValue_u64(value);
                this.by_status = _value;
                break;
            }
            default:
                _chain.assert(false, "bad db index!");
        }
    }


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): ProposalDB {
        return new ProposalDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class VoteDB extends _chain.MultiIndex<Vote> {
    get by_propDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[0];
    }
    get by_voterDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[1];
    }

    
    updateBy_prop(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

    
    updateBy_voter(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

}

@table("votes", nocodegen)

class Vote implements _chain.MultiIndexValue {
    
    constructor(
        public id:          u64  = 0,
        public proposal_id: u64  = 0,
        public voter:       Name = EMPTY_NAME,
        public approve:     bool = false,
        public voted_at:    u32  = 0
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_prop(): u64 { return this.proposal_id; }
    set by_prop(v: u64) { this.proposal_id = v; }

    @secondary
    get by_voter(): u64 { return this.voter.N; }
    set by_voter(v: u64) { this.voter = new Name(v); }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.packNumber<u64>(this.proposal_id);
        enc.pack(this.voter);
        enc.packNumber<bool>(this.approve);
        enc.packNumber<u32>(this.voted_at);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u64>();
        this.proposal_id = dec.unpackNumber<u64>();
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.voter = obj;
        }
        this.approve = dec.unpackNumber<bool>();
        this.voted_at = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += sizeof<u64>();
        size += this.voter.getSize();
        size += sizeof<bool>();
        size += sizeof<u32>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xDD32AC0000000000);
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
        return Vote.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Vote.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        switch (i) {
            case 0: {
                return _chain.newSecondaryValue_u64(this.by_prop);
                break;
            }
            case 1: {
                return _chain.newSecondaryValue_u64(this.by_voter);
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
                this.by_prop = _value;
                break;
            }
            case 1: {
                let _value = _chain.getSecondaryValue_u64(value);
                this.by_voter = _value;
                break;
            }
            default:
                _chain.assert(false, "bad db index!");
        }
    }


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): VoteDB {
        return new VoteDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class ConfigDB extends _chain.MultiIndex<Config> {

}

@table("config", nocodegen)

class Config implements _chain.MultiIndexValue {
    
    constructor(
        public admin:              Name = EMPTY_NAME,
        public quorum:             u32  = 2,          // min votes to pass
        public approval_threshold: u32  = 51,         // percent
        public voting_period:      u32  = 604_800,    // 7 days in seconds
        public total_leaders:      u32  = 0
    ) {  }

    @primary
    get primary(): u64 { return 0; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin);
        enc.packNumber<u32>(this.quorum);
        enc.packNumber<u32>(this.approval_threshold);
        enc.packNumber<u32>(this.voting_period);
        enc.packNumber<u32>(this.total_leaders);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.admin = obj;
        }
        this.quorum = dec.unpackNumber<u32>();
        this.approval_threshold = dec.unpackNumber<u32>();
        this.voting_period = dec.unpackNumber<u32>();
        this.total_leaders = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin.getSize();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
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


class setconfigAction implements _chain.Packer {
    constructor (
        public admin: _chain.Name | null = null,
        public quorum: u32 = 0,
        public approval_threshold: u32 = 0,
        public voting_period: u32 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin!);
        enc.packNumber<u32>(this.quorum);
        enc.packNumber<u32>(this.approval_threshold);
        enc.packNumber<u32>(this.voting_period);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.admin! = obj;
        }
        this.quorum = dec.unpackNumber<u32>();
        this.approval_threshold = dec.unpackNumber<u32>();
        this.voting_period = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin!.getSize();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        return size;
    }
}

class addleaderAction implements _chain.Packer {
    constructor (
        public account: _chain.Name | null = null,
        public title: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account!);
        enc.packString(this.title);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.account! = obj;
        }
        this.title = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account!.getSize();
        size += _chain.Utils.calcPackedStringLength(this.title);
        return size;
    }
}

class removeleaderAction implements _chain.Packer {
    constructor (
        public account: _chain.Name | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.account! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account!.getSize();
        return size;
    }
}

class proposeAction implements _chain.Packer {
    constructor (
        public proposer: _chain.Name | null = null,
        public prop_type: u8 = 0,
        public title: string = "",
        public description: string = "",
        public payload: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.proposer!);
        enc.packNumber<u8>(this.prop_type);
        enc.packString(this.title);
        enc.packString(this.description);
        enc.packString(this.payload);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.proposer! = obj;
        }
        this.prop_type = dec.unpackNumber<u8>();
        this.title = dec.unpackString();
        this.description = dec.unpackString();
        this.payload = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.proposer!.getSize();
        size += sizeof<u8>();
        size += _chain.Utils.calcPackedStringLength(this.title);
        size += _chain.Utils.calcPackedStringLength(this.description);
        size += _chain.Utils.calcPackedStringLength(this.payload);
        return size;
    }
}

class voteAction implements _chain.Packer {
    constructor (
        public voter: _chain.Name | null = null,
        public proposal_id: u64 = 0,
        public approve: bool = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.voter!);
        enc.packNumber<u64>(this.proposal_id);
        enc.packNumber<bool>(this.approve);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.voter! = obj;
        }
        this.proposal_id = dec.unpackNumber<u64>();
        this.approve = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.voter!.getSize();
        size += sizeof<u64>();
        size += sizeof<bool>();
        return size;
    }
}

class executeAction implements _chain.Packer {
    constructor (
        public executor: _chain.Name | null = null,
        public proposal_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.executor!);
        enc.packNumber<u64>(this.proposal_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.executor! = obj;
        }
        this.proposal_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.executor!.getSize();
        size += sizeof<u64>();
        return size;
    }
}

class cancelAction implements _chain.Packer {
    constructor (
        public proposal_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.proposal_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.proposal_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        return size;
    }
}

export function apply(receiver: u64, firstReceiver: u64, action: u64): void {
	const _receiver = new _chain.Name(receiver);
	const _firstReceiver = new _chain.Name(firstReceiver);
	const _action = new _chain.Name(action);

	const mycontract = new gcsclead1111(_receiver, _firstReceiver, _action);
	const actionData = _chain.readActionData();

	if (receiver == firstReceiver) {
		if (action == 0xC2B28A4D6E600000) {//setconfig
            const args = new setconfigAction();
            args.unpack(actionData);
            mycontract.setconfig(args.admin!,args.quorum,args.approval_threshold,args.voting_period);
        }
		if (action == 0x325315192AB80000) {//addleader
            const args = new addleaderAction();
            args.unpack(actionData);
            mycontract.addleader(args.account!,args.title);
        }
		if (action == 0xBAA54DAA2A325570) {//removeleader
            const args = new removeleaderAction();
            args.unpack(actionData);
            mycontract.removeleader(args.account!);
        }
		if (action == 0xADE95A6140000000) {//propose
            const args = new proposeAction();
            args.unpack(actionData);
            mycontract.propose(args.proposer!,args.prop_type,args.title,args.description,args.payload);
        }
		if (action == 0xDD32A00000000000) {//vote
            const args = new voteAction();
            args.unpack(actionData);
            mycontract.vote(args.voter!,args.proposal_id,args.approve);
        }
		if (action == 0x57548D6540000000) {//execute
            const args = new executeAction();
            args.unpack(actionData);
            mycontract.execute(args.executor!,args.proposal_id);
        }
		if (action == 0x41A6854400000000) {//cancel
            const args = new cancelAction();
            args.unpack(actionData);
            mycontract.cancel(args.proposal_id);
        }
	}
  
	if (receiver != firstReceiver) {
		
	}
	return;
}
