/**
 * gcscstake111 – GCSC Staking Contract
 *
 * Users stake GCSC tokens to earn rewards.
 * Staking flow:
 *   1. User gives gcscstake111@eosio.code permission on their account.
 *   2. User calls stake(staker, amount).  Contract pulls tokens via inline transfer.
 *   3. After lock_period, user calls unstake(staker, amount).
 *   4. User calls claimreward(staker) any time to collect accrued rewards.
 *
 * Reward formula (simplified): reward = principal * apy_bps * elapsed_secs / (10000 * 31536000)
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

// ─── Tables ───────────────────────────────────────────────────────────────────

@table("stakes")
class Stake extends Table {
    constructor(
        public staker:         Name = EMPTY_NAME,
        public staked_amount:  i64  = 0,
        public reward_debt:    i64  = 0,    // accumulated but not claimed
        public stake_time:     u32  = 0,
        public unstake_time:   u32  = 0,    // 0 = not unstaking
        public lock_end:       u32  = 0     // earliest time allowed to unstake
    ) { super(); }

    @primary
    get primary(): u64 { return this.staker.N; }
}

@table("rewardpool")
class RewardPool extends Table {
    constructor(
        public total_staked:    i64 = 0,
        public total_rewards:   i64 = 0,
        public distributed:     i64 = 0,
        public last_update:     u32 = 0
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

@table("config")
class Config extends Table {
    constructor(
        public admin:            Name = EMPTY_NAME,
        public token_contract:   Name = EMPTY_NAME,
        public token_symbol_raw: u64  = 0,
        public apy_bps:          u32  = 1200,   // 12.00%  (basis points)
        public lock_period:      u32  = 2_592_000, // 30 days
        public min_stake:        i64  = 100_0000,  // 100.0000 GCSC
        public paused:           bool = false
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

// ─── Contract ─────────────────────────────────────────────────────────────────

@contract
class gcscstake111 extends Contract {

    stakesTable:     TableStore<Stake>      = new TableStore<Stake>(this.receiver);
    rewardPoolTable: TableStore<RewardPool> = new TableStore<RewardPool>(this.receiver);
    configTable:     TableStore<Config>     = new TableStore<Config>(this.receiver);

    // ── setconfig ─────────────────────────────────────────────────────────────
    @action("setconfig")
    setconfig(
        admin:          Name,
        token_contract: Name,
        token_symbol:   Symbol,
        apy_bps:        u32,
        lock_period:    u32,
        min_stake:      Asset
    ): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin == EMPTY_NAME ? this.receiver : cfg.admin);

        check(isAccount(admin),          "admin does not exist");
        check(isAccount(token_contract), "token contract does not exist");
        check(apy_bps > 0,               "APY must be positive");
        check(lock_period > 0,           "lock period must be positive");
        check(min_stake.amount > 0,      "min stake must be positive");

        cfg.admin            = admin;
        cfg.token_contract   = token_contract;
        cfg.token_symbol_raw = token_symbol.value;
        cfg.apy_bps          = apy_bps;
        cfg.lock_period      = lock_period;
        cfg.min_stake        = min_stake.amount;
        this.configTable.set(cfg, this.receiver);
    }

    // ── fundrewards ───────────────────────────────────────────────────────────
    // Admin deposits reward tokens to the pool (contract must have eosio.code)
    @action("fundrewards")
    fundrewards(funder: Name, amount: Asset): void {
        requireAuth(funder);
        const cfg = this.getConfig();
        check(funder == cfg.admin, "only admin can fund rewards");

        sendTransfer(cfg.token_contract, funder, this.receiver, amount, "fund rewards");

        const pool       = this.getPool();
        pool.total_rewards += amount.amount;
        this.rewardPoolTable.set(pool, this.receiver);
    }

    // ── stake ─────────────────────────────────────────────────────────────────
    @action("stake")
    stake(staker: Name, amount: Asset): void {
        requireAuth(staker);

        const cfg = this.getConfig();
        check(!cfg.paused,          "staking is paused");
        check(isAccount(staker),    "staker does not exist");
        check(amount.isValid(),     "invalid amount");
        check(amount.amount >= cfg.min_stake, "amount below minimum stake");
        check(amount.symbol.value == cfg.token_symbol_raw, "wrong token symbol");

        // Pull tokens from staker
        sendTransfer(cfg.token_contract, staker, this.receiver, amount, "stake");

        const now  = <u32>currentTimeSec();
        let   row  = this.stakesTable.get(staker.N);
        if (!row) {
            this.stakesTable.store(
                new Stake(staker, amount.amount, 0, now, 0, now + cfg.lock_period),
                staker
            );
        } else {
            // Settle pending rewards before adding to stake
            const pending       = this.calcReward(row, now, cfg);
            row.reward_debt    += pending;
            row.staked_amount  += amount.amount;
            row.stake_time      = now;
            row.lock_end        = now + cfg.lock_period;
            this.stakesTable.update(row, staker);
        }

        const pool       = this.getPool();
        pool.total_staked += amount.amount;
        pool.last_update   = now;
        this.rewardPoolTable.set(pool, this.receiver);
    }

    // ── unstake ───────────────────────────────────────────────────────────────
    @action("unstake")
    unstake(staker: Name, amount: Asset): void {
        requireAuth(staker);

        const cfg = this.getConfig();
        const row = this.stakesTable.requireGet(staker.N, "stake not found");
        check(amount.isValid(),                     "invalid amount");
        check(amount.amount > 0,                    "amount must be positive");
        check(amount.amount <= row.staked_amount,   "insufficient staked balance");
        check(row.unstake_time == 0,                "unstake already in progress");

        const now = <u32>currentTimeSec();
        check(now >= row.lock_end, "tokens are still locked");

        // Settle rewards
        const pending    = this.calcReward(row, now, cfg);
        row.reward_debt += pending;
        row.staked_amount -= amount.amount;
        row.unstake_time  = now;

        if (row.staked_amount == 0) {
            this.stakesTable.remove(row);
        } else {
            this.stakesTable.update(row, staker);
        }

        // Return tokens immediately
        sendTransfer(cfg.token_contract, this.receiver, staker, amount, "unstake");

        const pool         = this.getPool();
        pool.total_staked  = pool.total_staked > amount.amount ? pool.total_staked - amount.amount : 0;
        pool.last_update   = now;
        this.rewardPoolTable.set(pool, this.receiver);
    }

    // ── claimreward ───────────────────────────────────────────────────────────
    @action("claimreward")
    claimreward(staker: Name): void {
        requireAuth(staker);

        const cfg     = this.getConfig();
        const row     = this.stakesTable.requireGet(staker.N, "stake not found");
        const now     = <u32>currentTimeSec();
        const pending = this.calcReward(row, now, cfg) + row.reward_debt;
        check(pending > 0, "no rewards to claim");

        const pool = this.getPool();
        check(pending <= pool.total_rewards - pool.distributed, "insufficient reward pool");

        row.reward_debt     = 0;
        row.stake_time      = now;
        pool.distributed   += pending;
        pool.last_update    = now;

        this.stakesTable.update(row, staker);
        this.rewardPoolTable.set(pool, this.receiver);

        const sym    = Symbol.fromU64(cfg.token_symbol_raw);
        sendTransfer(cfg.token_contract, this.receiver, staker, new Asset(pending, sym), "staking reward");
    }

    // ── pause ─────────────────────────────────────────────────────────────────
    @action("pause")
    pause(paused: bool): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        cfg.paused = paused;
        this.configTable.set(cfg, this.receiver);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    calcReward(row: Stake, now: u32, cfg: Config): i64 {
        const elapsed   = now > row.stake_time ? now - row.stake_time : 0;
        // reward = principal * apy_bps * elapsed / (10000 * 31536000)
        const numerator = row.staked_amount * <i64>cfg.apy_bps * <i64>elapsed;
        return numerator / (10000 * 31_536_000);
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

    getPool(): RewardPool {
        let pool = this.rewardPoolTable.get(0);
        if (!pool) {
            pool = new RewardPool();
            this.rewardPoolTable.store(pool, this.receiver);
        }
        return pool;
    }
}
