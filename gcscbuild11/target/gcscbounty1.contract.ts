import * as _chain from "as-chain";
/**
 * gcscbounty1 – GCSC Social Media Bounty Contract
 *
 * Users earn GCSCBUILD for promoting GCSC on social media.
 * A Compliance Agent reviews submissions and approves/rejects.
 *
 * Flow:
 *   1. Admin creates campaigns with createcamp().
 *   2. Admin funds campaigns with GCSCBUILD via fundcamp().
 *   3. Users submit social media proof via submit(campaign_id, proof_url).
 *   4. Compliance Agent calls verify() or reject().
 *   5. Approved users call claim() to receive GCSCBUILD.
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
        public from:     Name   = EMPTY_NAME,
        public to:       Name   = EMPTY_NAME,
        public quantity: Asset  = new Asset(),
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



class BountyConfigDB extends _chain.MultiIndex<BountyConfig> {

}

@table("config", nocodegen)

class BountyConfig implements _chain.MultiIndexValue {
    
    constructor(
        public admin:             Name = EMPTY_NAME,
        public compliance_agent:  Name = EMPTY_NAME,
        public build_contract:    Name = EMPTY_NAME,
        public next_campaign_id:  u64  = 1,
        public next_sub_id:       u64  = 1,
        public paused:            bool = false
    ) {  }

    @primary
    get primary(): u64 { return 0; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin);
        enc.pack(this.compliance_agent);
        enc.pack(this.build_contract);
        enc.packNumber<u64>(this.next_campaign_id);
        enc.packNumber<u64>(this.next_sub_id);
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
            this.compliance_agent = obj;
        }
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.build_contract = obj;
        }
        this.next_campaign_id = dec.unpackNumber<u64>();
        this.next_sub_id = dec.unpackNumber<u64>();
        this.paused = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin.getSize();
        size += this.compliance_agent.getSize();
        size += this.build_contract.getSize();
        size += sizeof<u64>();
        size += sizeof<u64>();
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
        return BountyConfig.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return BountyConfig.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): BountyConfigDB {
        return new BountyConfigDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class CampaignDB extends _chain.MultiIndex<Campaign> {

}

@table("campaigns", nocodegen)

class Campaign implements _chain.MultiIndexValue {
    
    constructor(
        public id:              u64    = 0,
        public name:            string = "",
        public description:     string = "",
        public reward_per_task: i64    = 0,
        public max_tasks:       u32    = 0,
        public tasks_done:      u32    = 0,
        public budget:          i64    = 0,
        public start_time:      u32    = 0,
        public end_time:        u32    = 0,
        public active:          bool   = true
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.packString(this.name);
        enc.packString(this.description);
        enc.packNumber<i64>(this.reward_per_task);
        enc.packNumber<u32>(this.max_tasks);
        enc.packNumber<u32>(this.tasks_done);
        enc.packNumber<i64>(this.budget);
        enc.packNumber<u32>(this.start_time);
        enc.packNumber<u32>(this.end_time);
        enc.packNumber<bool>(this.active);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u64>();
        this.name = dec.unpackString();
        this.description = dec.unpackString();
        this.reward_per_task = dec.unpackNumber<i64>();
        this.max_tasks = dec.unpackNumber<u32>();
        this.tasks_done = dec.unpackNumber<u32>();
        this.budget = dec.unpackNumber<i64>();
        this.start_time = dec.unpackNumber<u32>();
        this.end_time = dec.unpackNumber<u32>();
        this.active = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += _chain.Utils.calcPackedStringLength(this.name);
        size += _chain.Utils.calcPackedStringLength(this.description);
        size += sizeof<i64>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<i64>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<bool>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x41A5533993C00000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Campaign.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Campaign.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): CampaignDB {
        return new CampaignDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}

// submission status: 0=pending, 1=approved, 2=rejected


class SubmissionDB extends _chain.MultiIndex<Submission> {

}

@table("submissions", nocodegen)

class Submission implements _chain.MultiIndexValue {
    
    constructor(
        public id:            u64    = 0,
        public campaign_id:   u64    = 0,
        public submitter:     Name   = EMPTY_NAME,
        public proof_url:     string = "",
        public submitted_at:  u32    = 0,
        public reviewed_at:   u32    = 0,
        public status:        u8     = 0,
        public reward:        i64    = 0,
        public reject_reason: string = ""
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.packNumber<u64>(this.campaign_id);
        enc.pack(this.submitter);
        enc.packString(this.proof_url);
        enc.packNumber<u32>(this.submitted_at);
        enc.packNumber<u32>(this.reviewed_at);
        enc.packNumber<u8>(this.status);
        enc.packNumber<i64>(this.reward);
        enc.packString(this.reject_reason);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u64>();
        this.campaign_id = dec.unpackNumber<u64>();
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.submitter = obj;
        }
        this.proof_url = dec.unpackString();
        this.submitted_at = dec.unpackNumber<u32>();
        this.reviewed_at = dec.unpackNumber<u32>();
        this.status = dec.unpackNumber<u8>();
        this.reward = dec.unpackNumber<i64>();
        this.reject_reason = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += sizeof<u64>();
        size += this.submitter.getSize();
        size += _chain.Utils.calcPackedStringLength(this.proof_url);
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u8>();
        size += sizeof<i64>();
        size += _chain.Utils.calcPackedStringLength(this.reject_reason);
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xC68F27630EA4F000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Submission.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Submission.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): SubmissionDB {
        return new SubmissionDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class PendingRewardDB extends _chain.MultiIndex<PendingReward> {

}

@table("rewards", nocodegen)

class PendingReward implements _chain.MultiIndexValue {
    
    constructor(
        public account:   Name = EMPTY_NAME,
        public claimable: i64  = 0
    ) {  }

    @primary
    get primary(): u64 { return this.account.N; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account);
        enc.packNumber<i64>(this.claimable);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.account = obj;
        }
        this.claimable = dec.unpackNumber<i64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account.getSize();
        size += sizeof<i64>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xBAB86BA700000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return PendingReward.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return PendingReward.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): PendingRewardDB {
        return new PendingRewardDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}

// ─── Contract ─────────────────────────────────────────────────────────────────

@contract
class gcscbounty1 extends Contract {

    @action("setconfig")
    setconfig(admin: Name, compliance_agent: Name, build_contract: Name): void {
        const cfgTable = new TableStore<BountyConfig>(this.receiver, this.receiver);
        const existing = cfgTable.get(0);
        if (existing) requireAuth(existing.admin);
        else           requireAuth(this.receiver);

        check(isAccount(admin),            "admin account does not exist");
        check(isAccount(compliance_agent), "compliance_agent account does not exist");
        check(isAccount(build_contract),   "build_contract does not exist");

        if (existing) {
            existing.admin            = admin;
            existing.compliance_agent = compliance_agent;
            existing.build_contract   = build_contract;
            cfgTable.update(existing, this.receiver);
        } else {
            cfgTable.store(new BountyConfig(admin, compliance_agent, build_contract, 1, 1, false), this.receiver);
        }
    }

    @action("createcamp")
    createcamp(
        name:            string,
        description:     string,
        reward_per_task: i64,
        max_tasks:       u32,
        start_time:      u32,
        end_time:        u32
    ): void {
        const cfgTable = new TableStore<BountyConfig>(this.receiver, this.receiver);
        const cfg      = cfgTable.requireGet(0, "contract not configured");
        requireAuth(cfg.admin);

        check(name.length > 0,       "campaign name cannot be empty");
        check(reward_per_task > 0,   "reward must be positive");
        check(max_tasks > 0,         "max_tasks must be positive");
        check(end_time > start_time, "end_time must be after start_time");

        const campTable = new TableStore<Campaign>(this.receiver, this.receiver);
        const campId    = cfg.next_campaign_id;
        campTable.store(new Campaign(
            campId, name, description, reward_per_task,
            max_tasks, 0, 0, start_time, end_time, true
        ), this.receiver);

        cfg.next_campaign_id += 1;
        cfgTable.update(cfg, this.receiver);
    }

    @action("fundcamp")
    fundcamp(funder: Name, campaign_id: u64, amount: i64): void {
        requireAuth(funder);
        const cfgTable  = new TableStore<BountyConfig>(this.receiver, this.receiver);
        const cfg       = cfgTable.requireGet(0, "contract not configured");
        const campTable = new TableStore<Campaign>(this.receiver, this.receiver);
        const camp      = campTable.requireGet(campaign_id, "campaign not found");
        check(camp.active, "campaign is not active");
        check(amount > 0,  "amount must be positive");

        const buildSym = new Symbol("GCSCBLD", 4);
        sendTransfer(cfg.build_contract, funder, this.receiver, new Asset(amount, buildSym), "campaign fund");

        camp.budget += amount;
        campTable.update(camp, this.receiver);
    }

    @action("submit")
    submit(submitter: Name, campaign_id: u64, proof_url: string): void {
        requireAuth(submitter);
        check(proof_url.length > 0 && proof_url.length <= 512, "proof_url must be 1-512 chars");

        const cfgTable  = new TableStore<BountyConfig>(this.receiver, this.receiver);
        const cfg       = cfgTable.requireGet(0, "contract not configured");
        check(!cfg.paused, "bounty system is paused");

        const campTable = new TableStore<Campaign>(this.receiver, this.receiver);
        const camp      = campTable.requireGet(campaign_id, "campaign not found");
        check(camp.active, "campaign is not active");

        const now = currentTimeSec();
        check(now >= camp.start_time,              "campaign not started yet");
        check(now <  camp.end_time,                "campaign has ended");
        check(camp.tasks_done < camp.max_tasks,    "campaign task limit reached");
        check(camp.budget >= camp.reward_per_task, "campaign budget exhausted");

        const subTable = new TableStore<Submission>(this.receiver, this.receiver);
        const subId    = cfg.next_sub_id;
        subTable.store(new Submission(
            subId, campaign_id, submitter, proof_url, now, 0, 0, camp.reward_per_task, ""
        ), this.receiver);

        cfg.next_sub_id += 1;
        cfgTable.update(cfg, this.receiver);
    }

    @action("verify")
    verify(submission_id: u64): void {
        const cfgTable = new TableStore<BountyConfig>(this.receiver, this.receiver);
        const cfg      = cfgTable.requireGet(0, "contract not configured");
        requireAuth(cfg.compliance_agent);

        const subTable = new TableStore<Submission>(this.receiver, this.receiver);
        const sub      = subTable.requireGet(submission_id, "submission not found");
        check(sub.status == 0, "submission already reviewed");

        const campTable = new TableStore<Campaign>(this.receiver, this.receiver);
        const camp      = campTable.requireGet(sub.campaign_id, "campaign not found");
        check(camp.budget >= sub.reward, "campaign budget exhausted");

        sub.status      = 1;
        sub.reviewed_at = currentTimeSec();
        subTable.update(sub, this.receiver);

        camp.tasks_done += 1;
        camp.budget     -= sub.reward;
        campTable.update(camp, this.receiver);

        // Accrue reward to submitter
        const rewTable = new TableStore<PendingReward>(this.receiver, this.receiver);
        const existing = rewTable.get(sub.submitter.N);
        if (existing) {
            existing.claimable += sub.reward;
            rewTable.update(existing, this.receiver);
        } else {
            rewTable.store(new PendingReward(sub.submitter, sub.reward), this.receiver);
        }
    }

    @action("reject")
    reject(submission_id: u64, reason: string): void {
        const cfgTable = new TableStore<BountyConfig>(this.receiver, this.receiver);
        const cfg      = cfgTable.requireGet(0, "contract not configured");
        requireAuth(cfg.compliance_agent);

        const subTable = new TableStore<Submission>(this.receiver, this.receiver);
        const sub      = subTable.requireGet(submission_id, "submission not found");
        check(sub.status == 0, "submission already reviewed");

        sub.status        = 2;
        sub.reviewed_at   = currentTimeSec();
        sub.reject_reason = reason;
        subTable.update(sub, this.receiver);
    }

    @action("claim")
    claim(account: Name): void {
        requireAuth(account);
        const cfgTable = new TableStore<BountyConfig>(this.receiver, this.receiver);
        const cfg      = cfgTable.requireGet(0, "contract not configured");

        const rewTable = new TableStore<PendingReward>(this.receiver, this.receiver);
        const row      = rewTable.requireGet(account.N, "no claimable rewards");
        check(row.claimable > 0, "no claimable rewards");

        const buildSym = new Symbol("GCSCBLD", 4);
        sendTransfer(cfg.build_contract, this.receiver, account,
            new Asset(row.claimable, buildSym), "bounty reward");

        row.claimable = 0;
        rewTable.update(row, this.receiver);
    }

    @action("pause")
    pause(paused: bool): void {
        const cfgTable = new TableStore<BountyConfig>(this.receiver, this.receiver);
        const cfg      = cfgTable.requireGet(0, "contract not configured");
        requireAuth(cfg.admin);
        cfg.paused = paused;
        cfgTable.update(cfg, this.receiver);
    }

    @action("deactivate")
    deactivate(campaign_id: u64): void {
        const cfgTable = new TableStore<BountyConfig>(this.receiver, this.receiver);
        const cfg      = cfgTable.requireGet(0, "contract not configured");
        requireAuth(cfg.admin);

        const campTable = new TableStore<Campaign>(this.receiver, this.receiver);
        const camp      = campTable.requireGet(campaign_id, "campaign not found");
        camp.active = false;
        campTable.update(camp, this.receiver);
    }
}


class setconfigAction implements _chain.Packer {
    constructor (
        public admin: _chain.Name | null = null,
        public compliance_agent: _chain.Name | null = null,
        public build_contract: _chain.Name | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin!);
        enc.pack(this.compliance_agent!);
        enc.pack(this.build_contract!);
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
            this.compliance_agent! = obj;
        }
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.build_contract! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin!.getSize();
        size += this.compliance_agent!.getSize();
        size += this.build_contract!.getSize();
        return size;
    }
}

class createcampAction implements _chain.Packer {
    constructor (
        public name: string = "",
        public description: string = "",
        public reward_per_task: i64 = 0,
        public max_tasks: u32 = 0,
        public start_time: u32 = 0,
        public end_time: u32 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packString(this.name);
        enc.packString(this.description);
        enc.packNumber<i64>(this.reward_per_task);
        enc.packNumber<u32>(this.max_tasks);
        enc.packNumber<u32>(this.start_time);
        enc.packNumber<u32>(this.end_time);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.name = dec.unpackString();
        this.description = dec.unpackString();
        this.reward_per_task = dec.unpackNumber<i64>();
        this.max_tasks = dec.unpackNumber<u32>();
        this.start_time = dec.unpackNumber<u32>();
        this.end_time = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += _chain.Utils.calcPackedStringLength(this.name);
        size += _chain.Utils.calcPackedStringLength(this.description);
        size += sizeof<i64>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        return size;
    }
}

class fundcampAction implements _chain.Packer {
    constructor (
        public funder: _chain.Name | null = null,
        public campaign_id: u64 = 0,
        public amount: i64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.funder!);
        enc.packNumber<u64>(this.campaign_id);
        enc.packNumber<i64>(this.amount);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.funder! = obj;
        }
        this.campaign_id = dec.unpackNumber<u64>();
        this.amount = dec.unpackNumber<i64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.funder!.getSize();
        size += sizeof<u64>();
        size += sizeof<i64>();
        return size;
    }
}

class submitAction implements _chain.Packer {
    constructor (
        public submitter: _chain.Name | null = null,
        public campaign_id: u64 = 0,
        public proof_url: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.submitter!);
        enc.packNumber<u64>(this.campaign_id);
        enc.packString(this.proof_url);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.submitter! = obj;
        }
        this.campaign_id = dec.unpackNumber<u64>();
        this.proof_url = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.submitter!.getSize();
        size += sizeof<u64>();
        size += _chain.Utils.calcPackedStringLength(this.proof_url);
        return size;
    }
}

class verifyAction implements _chain.Packer {
    constructor (
        public submission_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.submission_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.submission_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        return size;
    }
}

class rejectAction implements _chain.Packer {
    constructor (
        public submission_id: u64 = 0,
        public reason: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.submission_id);
        enc.packString(this.reason);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.submission_id = dec.unpackNumber<u64>();
        this.reason = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += _chain.Utils.calcPackedStringLength(this.reason);
        return size;
    }
}

class claimAction implements _chain.Packer {
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

class pauseAction implements _chain.Packer {
    constructor (
        public paused: bool = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<bool>(this.paused);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.paused = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<bool>();
        return size;
    }
}

class deactivateAction implements _chain.Packer {
    constructor (
        public campaign_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.campaign_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.campaign_id = dec.unpackNumber<u64>();
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

	const mycontract = new gcscbounty1(_receiver, _firstReceiver, _action);
	const actionData = _chain.readActionData();

	if (receiver == firstReceiver) {
		if (action == 0xC2B28A4D6E600000) {//setconfig
            const args = new setconfigAction();
            args.unpack(actionData);
            mycontract.setconfig(args.admin!,args.compliance_agent!,args.build_contract!);
        }
		if (action == 0x45D46CA906954000) {//createcamp
            const args = new createcampAction();
            args.unpack(actionData);
            mycontract.createcamp(args.name,args.description,args.reward_per_task,args.max_tasks,args.start_time,args.end_time);
        }
		if (action == 0x5EA6941A55000000) {//fundcamp
            const args = new fundcampAction();
            args.unpack(actionData);
            mycontract.fundcamp(args.funder!,args.campaign_id,args.amount);
        }
		if (action == 0xC68F276400000000) {//submit
            const args = new submitAction();
            args.unpack(actionData);
            mycontract.submit(args.submitter!,args.campaign_id,args.proof_url);
        }
		if (action == 0xDAAEE5F800000000) {//verify
            const args = new verifyAction();
            args.unpack(actionData);
            mycontract.verify(args.submission_id);
        }
		if (action == 0xBA9EA46400000000) {//reject
            const args = new rejectAction();
            args.unpack(actionData);
            mycontract.reject(args.submission_id,args.reason);
        }
		if (action == 0x444CE90000000000) {//claim
            const args = new claimAction();
            args.unpack(actionData);
            mycontract.claim(args.account!);
        }
		if (action == 0xA9B5850000000000) {//pause
            const args = new pauseAction();
            args.unpack(actionData);
            mycontract.pause(args.paused);
        }
		if (action == 0x4A8C8CBB66CA8000) {//deactivate
            const args = new deactivateAction();
            args.unpack(actionData);
            mycontract.deactivate(args.campaign_id);
        }
	}
  
	if (receiver != firstReceiver) {
		
	}
	return;
}
