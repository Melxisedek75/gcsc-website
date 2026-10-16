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

@packer
class Transfer extends ActionData {
    constructor(
        public from:     Name   = EMPTY_NAME,
        public to:       Name   = EMPTY_NAME,
        public quantity: Asset  = new Asset(),
        public memo:     string = ""
    ) { super(); }
}

function sendTransfer(contract: Name, from: Name, to: Name, quantity: Asset, memo: string): void {
    new InlineAction<Transfer>("transfer")
        .act(contract, new PermissionLevel(from))
        .send(new Transfer(from, to, quantity, memo));
}

// ─── Tables ───────────────────────────────────────────────────────────────────

@table("config")
class BountyConfig extends Table {
    constructor(
        public admin:             Name = EMPTY_NAME,
        public compliance_agent:  Name = EMPTY_NAME,
        public build_contract:    Name = EMPTY_NAME,
        public next_campaign_id:  u64  = 1,
        public next_sub_id:       u64  = 1,
        public paused:            bool = false
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

@table("campaigns")
class Campaign extends Table {
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
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }
}

// submission status: 0=pending, 1=approved, 2=rejected
@table("submissions")
class Submission extends Table {
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
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }
}

@table("rewards")
class PendingReward extends Table {
    constructor(
        public account:   Name = EMPTY_NAME,
        public claimable: i64  = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.account.N; }
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
