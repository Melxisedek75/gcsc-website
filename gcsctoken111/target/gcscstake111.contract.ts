import * as _chain from "as-chain";
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


@packer(nocodegen)
class Transfer implements _chain.Packer {
    
    constructor(
        public from:     Name  = EMPTY_NAME,
        public to:       Name  = EMPTY_NAME,
        public quantity: Asset = new Asset(),
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



class StakeDB extends _chain.MultiIndex<Stake> {

}

@table("stakes", nocodegen)

class Stake implements _chain.MultiIndexValue {
    
    constructor(
        public staker:         Name = EMPTY_NAME,
        public staked_amount:  i64  = 0,
        public reward_debt:    i64  = 0,    // accumulated but not claimed
        public stake_time:     u32  = 0,
        public unstake_time:   u32  = 0,    // 0 = not unstaking
        public lock_end:       u32  = 0     // earliest time allowed to unstake
    ) {  }

    @primary
    get primary(): u64 { return this.staker.N; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.staker);
        enc.packNumber<i64>(this.staked_amount);
        enc.packNumber<i64>(this.reward_debt);
        enc.packNumber<u32>(this.stake_time);
        enc.packNumber<u32>(this.unstake_time);
        enc.packNumber<u32>(this.lock_end);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.staker = obj;
        }
        this.staked_amount = dec.unpackNumber<i64>();
        this.reward_debt = dec.unpackNumber<i64>();
        this.stake_time = dec.unpackNumber<u32>();
        this.unstake_time = dec.unpackNumber<u32>();
        this.lock_end = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.staker.getSize();
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xC64D056000000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Stake.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Stake.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): StakeDB {
        return new StakeDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class RewardPoolDB extends _chain.MultiIndex<RewardPool> {

}

@table("rewardpool", nocodegen)

class RewardPool implements _chain.MultiIndexValue {
    
    constructor(
        public total_staked:    i64 = 0,
        public total_rewards:   i64 = 0,
        public distributed:     i64 = 0,
        public last_update:     u32 = 0
    ) {  }

    @primary
    get primary(): u64 { return 0; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<i64>(this.total_staked);
        enc.packNumber<i64>(this.total_rewards);
        enc.packNumber<i64>(this.distributed);
        enc.packNumber<u32>(this.last_update);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.total_staked = dec.unpackNumber<i64>();
        this.total_rewards = dec.unpackNumber<i64>();
        this.distributed = dec.unpackNumber<i64>();
        this.last_update = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<u32>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xBAB86BA6B4A44000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return RewardPool.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return RewardPool.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): RewardPoolDB {
        return new RewardPoolDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class ConfigDB extends _chain.MultiIndex<Config> {

}

@table("config", nocodegen)

class Config implements _chain.MultiIndexValue {
    
    constructor(
        public admin:            Name = EMPTY_NAME,
        public token_contract:   Name = EMPTY_NAME,
        public token_symbol_raw: u64  = 0,
        public apy_bps:          u32  = 1200,   // 12.00%  (basis points)
        public lock_period:      u32  = 2_592_000, // 30 days
        public min_stake:        i64  = 100_0000,  // 100.0000 GCSC
        public paused:           bool = false
    ) {  }

    @primary
    get primary(): u64 { return 0; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin);
        enc.pack(this.token_contract);
        enc.packNumber<u64>(this.token_symbol_raw);
        enc.packNumber<u32>(this.apy_bps);
        enc.packNumber<u32>(this.lock_period);
        enc.packNumber<i64>(this.min_stake);
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
            this.token_contract = obj;
        }
        this.token_symbol_raw = dec.unpackNumber<u64>();
        this.apy_bps = dec.unpackNumber<u32>();
        this.lock_period = dec.unpackNumber<u32>();
        this.min_stake = dec.unpackNumber<i64>();
        this.paused = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin.getSize();
        size += this.token_contract.getSize();
        size += sizeof<u64>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<i64>();
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


class setconfigAction implements _chain.Packer {
    constructor (
        public admin: _chain.Name | null = null,
        public token_contract: _chain.Name | null = null,
        public token_symbol: _chain.Symbol | null = null,
        public apy_bps: u32 = 0,
        public lock_period: u32 = 0,
        public min_stake: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin!);
        enc.pack(this.token_contract!);
        enc.pack(this.token_symbol!);
        enc.packNumber<u32>(this.apy_bps);
        enc.packNumber<u32>(this.lock_period);
        enc.pack(this.min_stake!);
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
            this.token_contract! = obj;
        }
        
        {
            let obj = new _chain.Symbol();
            dec.unpack(obj);
            this.token_symbol! = obj;
        }
        this.apy_bps = dec.unpackNumber<u32>();
        this.lock_period = dec.unpackNumber<u32>();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.min_stake! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin!.getSize();
        size += this.token_contract!.getSize();
        size += this.token_symbol!.getSize();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += this.min_stake!.getSize();
        return size;
    }
}

class fundrewardsAction implements _chain.Packer {
    constructor (
        public funder: _chain.Name | null = null,
        public amount: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.funder!);
        enc.pack(this.amount!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.funder! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.amount! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.funder!.getSize();
        size += this.amount!.getSize();
        return size;
    }
}

class stakeAction implements _chain.Packer {
    constructor (
        public staker: _chain.Name | null = null,
        public amount: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.staker!);
        enc.pack(this.amount!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.staker! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.amount! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.staker!.getSize();
        size += this.amount!.getSize();
        return size;
    }
}

class unstakeAction implements _chain.Packer {
    constructor (
        public staker: _chain.Name | null = null,
        public amount: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.staker!);
        enc.pack(this.amount!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.staker! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.amount! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.staker!.getSize();
        size += this.amount!.getSize();
        return size;
    }
}

class claimrewardAction implements _chain.Packer {
    constructor (
        public staker: _chain.Name | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.staker!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.staker! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.staker!.getSize();
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

export function apply(receiver: u64, firstReceiver: u64, action: u64): void {
	const _receiver = new _chain.Name(receiver);
	const _firstReceiver = new _chain.Name(firstReceiver);
	const _action = new _chain.Name(action);

	const mycontract = new gcscstake111(_receiver, _firstReceiver, _action);
	const actionData = _chain.readActionData();

	if (receiver == firstReceiver) {
		if (action == 0xC2B28A4D6E600000) {//setconfig
            const args = new setconfigAction();
            args.unpack(actionData);
            mycontract.setconfig(args.admin!,args.token_contract!,args.token_symbol!,args.apy_bps,args.lock_period,args.min_stake!);
        }
		if (action == 0x5EA69BAB86BA7000) {//fundrewards
            const args = new fundrewardsAction();
            args.unpack(actionData);
            mycontract.fundrewards(args.funder!,args.amount!);
        }
		if (action == 0xC64D050000000000) {//stake
            const args = new stakeAction();
            args.unpack(actionData);
            mycontract.stake(args.staker!,args.amount!);
        }
		if (action == 0xD4F1934140000000) {//unstake
            const args = new unstakeAction();
            args.unpack(actionData);
            mycontract.unstake(args.staker!,args.amount!);
        }
		if (action == 0x444CE95D5C35D200) {//claimreward
            const args = new claimrewardAction();
            args.unpack(actionData);
            mycontract.claimreward(args.staker!);
        }
		if (action == 0xA9B5850000000000) {//pause
            const args = new pauseAction();
            args.unpack(actionData);
            mycontract.pause(args.paused);
        }
	}
  
	if (receiver != firstReceiver) {
		
	}
	return;
}
