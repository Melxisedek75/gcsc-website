import * as _chain from "as-chain";
/**
 * gcscmember11 – GCSC Membership Contract
 *
 * Manages member registration, tiers, fees, and verification.
 * Tiers: 0 = BASIC | 1 = STANDARD | 2 = PREMIUM
 */
import {
    Contract, Table, TableStore, Name, Asset, Symbol,
    check, requireAuth, isAccount, currentTimeSec,
    EMPTY_NAME, ActionData, InlineAction, PermissionLevel
} from "proton-tsc";

// ─── Inline-action helper (pulls GCSC from caller via eosio.code) ─────────────


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

function sendTransfer(tokenContract: Name, from: Name, to: Name, quantity: Asset, memo: string): void {
    const action = new InlineAction<Transfer>("transfer");
    action.act(tokenContract, new PermissionLevel(from)).send(
        new Transfer(from, to, quantity, memo)
    );
}

// ─── Tables ───────────────────────────────────────────────────────────────────

// Tiers
const TIER_BASIC:    u8 = 0;
const TIER_STANDARD: u8 = 1;
const TIER_PREMIUM:  u8 = 2;



class MemberDB extends _chain.MultiIndex<Member> {
    get by_tierDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[0];
    }

    
    updateBy_tier(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

}

@table("members", nocodegen)

class Member implements _chain.MultiIndexValue {
    
    constructor(
        public account:     Name   = EMPTY_NAME,
        public full_name:   string = "",
        public email_hash:  string = "",   // keccak/sha256 of email
        public tier:        u8     = TIER_BASIC,
        public is_verified: bool   = false,
        public join_date:   u32    = 0,
        public expiry_date: u32    = 0,
        public total_paid:  i64    = 0     // cumulative fees paid (raw)
    ) {  }

    @primary
    get primary(): u64 { return this.account.N; }

    @secondary
    get by_tier(): u64 { return <u64>this.tier; }
    set by_tier(v: u64) { this.tier = <u8>v; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account);
        enc.packString(this.full_name);
        enc.packString(this.email_hash);
        enc.packNumber<u8>(this.tier);
        enc.packNumber<bool>(this.is_verified);
        enc.packNumber<u32>(this.join_date);
        enc.packNumber<u32>(this.expiry_date);
        enc.packNumber<i64>(this.total_paid);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.account = obj;
        }
        this.full_name = dec.unpackString();
        this.email_hash = dec.unpackString();
        this.tier = dec.unpackNumber<u8>();
        this.is_verified = dec.unpackNumber<bool>();
        this.join_date = dec.unpackNumber<u32>();
        this.expiry_date = dec.unpackNumber<u32>();
        this.total_paid = dec.unpackNumber<i64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account.getSize();
        size += _chain.Utils.calcPackedStringLength(this.full_name);
        size += _chain.Utils.calcPackedStringLength(this.email_hash);
        size += sizeof<u8>();
        size += sizeof<bool>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<i64>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x92A4755F00000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
            new _chain.IDX64(code.N, scope.N, idxTableBase + 0, 0),
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Member.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Member.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        switch (i) {
            case 0: {
                return _chain.newSecondaryValue_u64(this.by_tier);
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
                this.by_tier = _value;
                break;
            }
            default:
                _chain.assert(false, "bad db index!");
        }
    }


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): MemberDB {
        return new MemberDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class ConfigDB extends _chain.MultiIndex<Config> {

}

@table("config", nocodegen)

class Config implements _chain.MultiIndexValue {
    
    constructor(
        public admin:                Name   = EMPTY_NAME,
        public token_contract:       Name   = EMPTY_NAME,
        public basic_fee:            i64    = 100_0000,   // 100.0000 GCSC
        public standard_fee:         i64    = 250_0000,
        public premium_fee:          i64    = 500_0000,
        public membership_duration:  u32    = 31_536_000, // 1 year in seconds
        public token_symbol_raw:     u64    = 0,
        public paused:               bool   = false
    ) {  }

    @primary
    get primary(): u64 { return 0; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin);
        enc.pack(this.token_contract);
        enc.packNumber<i64>(this.basic_fee);
        enc.packNumber<i64>(this.standard_fee);
        enc.packNumber<i64>(this.premium_fee);
        enc.packNumber<u32>(this.membership_duration);
        enc.packNumber<u64>(this.token_symbol_raw);
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
        this.basic_fee = dec.unpackNumber<i64>();
        this.standard_fee = dec.unpackNumber<i64>();
        this.premium_fee = dec.unpackNumber<i64>();
        this.membership_duration = dec.unpackNumber<u32>();
        this.token_symbol_raw = dec.unpackNumber<u64>();
        this.paused = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin.getSize();
        size += this.token_contract.getSize();
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<u32>();
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
class gcscmember11 extends Contract {

    membersTable: TableStore<Member> = new TableStore<Member>(this.receiver);
    configTable:  TableStore<Config> = new TableStore<Config>(this.receiver);

    // ── setconfig ─────────────────────────────────────────────────────────────
    @action("setconfig")
    setconfig(
        admin:           Name,
        token_contract:  Name,
        basic_fee:       Asset,
        standard_fee:    Asset,
        premium_fee:     Asset,
        membership_secs: u32
    ): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin == EMPTY_NAME ? this.receiver : cfg.admin);

        check(isAccount(admin),          "admin account does not exist");
        check(isAccount(token_contract), "token contract does not exist");
        check(basic_fee.amount > 0,      "basic fee must be positive");
        check(standard_fee.amount > basic_fee.amount,    "standard fee must exceed basic");
        check(premium_fee.amount > standard_fee.amount,  "premium fee must exceed standard");
        check(membership_secs > 0,       "duration must be positive");

        cfg.admin               = admin;
        cfg.token_contract      = token_contract;
        cfg.basic_fee           = basic_fee.amount;
        cfg.standard_fee        = standard_fee.amount;
        cfg.premium_fee         = premium_fee.amount;
        cfg.membership_duration = membership_secs;
        cfg.token_symbol_raw    = basic_fee.symbol.value;
        this.configTable.set(cfg, this.receiver);
    }

    // ── regmember ─────────────────────────────────────────────────────────────
    @action("regmember")
    regmember(account: Name, full_name: string, email_hash: string, tier: u8): void {
        requireAuth(account);

        const cfg = this.getConfig();
        check(!cfg.paused,          "contract is paused");
        check(isAccount(account),   "account does not exist");
        check(full_name.length > 0, "full name required");
        check(email_hash.length > 0,"email hash required");
        check(tier <= TIER_PREMIUM, "invalid tier");
        check(!this.membersTable.exists(account.N), "account is already a member");

        const fee = this.feeForTier(tier, cfg);
        const sym = Symbol.fromU64(cfg.token_symbol_raw);

        // Pull fee from member via eosio.code permission
        sendTransfer(
            cfg.token_contract, account, this.receiver,
            new Asset(fee, sym), "membership fee"
        );

        const now     = <u32>currentTimeSec();
        const expiry  = now + cfg.membership_duration;
        this.membersTable.store(
            new Member(account, full_name, email_hash, tier, false, now, expiry, fee),
            account
        );
    }

    // ── renewmember ───────────────────────────────────────────────────────────
    @action("renewmember")
    renewmember(account: Name): void {
        requireAuth(account);

        const cfg    = this.getConfig();
        check(!cfg.paused, "contract is paused");
        const member = this.membersTable.requireGet(account.N, "member not found");
        const fee    = this.feeForTier(member.tier, cfg);
        const sym    = Symbol.fromU64(cfg.token_symbol_raw);

        sendTransfer(
            cfg.token_contract, account, this.receiver,
            new Asset(fee, sym), "membership renewal"
        );

        const now           = <u32>currentTimeSec();
        const base          = member.expiry_date > now ? member.expiry_date : now;
        member.expiry_date  = base + cfg.membership_duration;
        member.total_paid  += fee;
        this.membersTable.update(member, account);
    }

    // ── upgrmember ────────────────────────────────────────────────────────────
    @action("upgrmember")
    upgrmember(account: Name, new_tier: u8): void {
        requireAuth(account);

        const cfg    = this.getConfig();
        check(!cfg.paused, "contract is paused");
        const member = this.membersTable.requireGet(account.N, "member not found");
        check(new_tier > member.tier,    "can only upgrade to a higher tier");
        check(new_tier <= TIER_PREMIUM,  "invalid tier");

        const extra_fee = this.feeForTier(new_tier, cfg) - this.feeForTier(member.tier, cfg);
        const sym       = Symbol.fromU64(cfg.token_symbol_raw);

        sendTransfer(
            cfg.token_contract, account, this.receiver,
            new Asset(extra_fee, sym), "tier upgrade"
        );

        member.tier        = new_tier;
        member.total_paid += extra_fee;
        this.membersTable.update(member, account);
    }

    // ── updmember ─────────────────────────────────────────────────────────────
    @action("updmember")
    updmember(account: Name, full_name: string, email_hash: string): void {
        requireAuth(account);
        const member     = this.membersTable.requireGet(account.N, "member not found");
        check(full_name.length > 0,  "full name required");
        check(email_hash.length > 0, "email hash required");
        member.full_name  = full_name;
        member.email_hash = email_hash;
        this.membersTable.update(member, account);
    }

    // ── verifymember ──────────────────────────────────────────────────────────
    @action("verifymember")
    verifymember(account: Name): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        const member       = this.membersTable.requireGet(account.N, "member not found");
        member.is_verified = true;
        this.membersTable.update(member, this.receiver);
    }

    // ── removemember ──────────────────────────────────────────────────────────
    @action("removemember")
    removemember(account: Name): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        const member = this.membersTable.requireGet(account.N, "member not found");
        this.membersTable.remove(member);
    }

    // ── pause / unpause ───────────────────────────────────────────────────────
    @action("pause")
    pause(paused: bool): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        cfg.paused = paused;
        this.configTable.set(cfg, this.receiver);
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

    feeForTier(tier: u8, cfg: Config): i64 {
        if (tier == TIER_STANDARD) return cfg.standard_fee;
        if (tier == TIER_PREMIUM)  return cfg.premium_fee;
        return cfg.basic_fee;
    }
}


class setconfigAction implements _chain.Packer {
    constructor (
        public admin: _chain.Name | null = null,
        public token_contract: _chain.Name | null = null,
        public basic_fee: _chain.Asset | null = null,
        public standard_fee: _chain.Asset | null = null,
        public premium_fee: _chain.Asset | null = null,
        public membership_secs: u32 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin!);
        enc.pack(this.token_contract!);
        enc.pack(this.basic_fee!);
        enc.pack(this.standard_fee!);
        enc.pack(this.premium_fee!);
        enc.packNumber<u32>(this.membership_secs);
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
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.basic_fee! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.standard_fee! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.premium_fee! = obj;
        }
        this.membership_secs = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin!.getSize();
        size += this.token_contract!.getSize();
        size += this.basic_fee!.getSize();
        size += this.standard_fee!.getSize();
        size += this.premium_fee!.getSize();
        size += sizeof<u32>();
        return size;
    }
}

class regmemberAction implements _chain.Packer {
    constructor (
        public account: _chain.Name | null = null,
        public full_name: string = "",
        public email_hash: string = "",
        public tier: u8 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account!);
        enc.packString(this.full_name);
        enc.packString(this.email_hash);
        enc.packNumber<u8>(this.tier);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.account! = obj;
        }
        this.full_name = dec.unpackString();
        this.email_hash = dec.unpackString();
        this.tier = dec.unpackNumber<u8>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account!.getSize();
        size += _chain.Utils.calcPackedStringLength(this.full_name);
        size += _chain.Utils.calcPackedStringLength(this.email_hash);
        size += sizeof<u8>();
        return size;
    }
}

class renewmemberAction implements _chain.Packer {
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

class upgrmemberAction implements _chain.Packer {
    constructor (
        public account: _chain.Name | null = null,
        public new_tier: u8 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account!);
        enc.packNumber<u8>(this.new_tier);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.account! = obj;
        }
        this.new_tier = dec.unpackNumber<u8>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account!.getSize();
        size += sizeof<u8>();
        return size;
    }
}

class updmemberAction implements _chain.Packer {
    constructor (
        public account: _chain.Name | null = null,
        public full_name: string = "",
        public email_hash: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account!);
        enc.packString(this.full_name);
        enc.packString(this.email_hash);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.account! = obj;
        }
        this.full_name = dec.unpackString();
        this.email_hash = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account!.getSize();
        size += _chain.Utils.calcPackedStringLength(this.full_name);
        size += _chain.Utils.calcPackedStringLength(this.email_hash);
        return size;
    }
}

class verifymemberAction implements _chain.Packer {
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

class removememberAction implements _chain.Packer {
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

export function apply(receiver: u64, firstReceiver: u64, action: u64): void {
	const _receiver = new _chain.Name(receiver);
	const _firstReceiver = new _chain.Name(firstReceiver);
	const _action = new _chain.Name(action);

	const mycontract = new gcscmember11(_receiver, _firstReceiver, _action);
	const actionData = _chain.readActionData();

	if (receiver == firstReceiver) {
		if (action == 0xC2B28A4D6E600000) {//setconfig
            const args = new setconfigAction();
            args.unpack(actionData);
            mycontract.setconfig(args.admin!,args.token_contract!,args.basic_fee!,args.standard_fee!,args.premium_fee!,args.membership_secs);
        }
		if (action == 0xBA992548EAB80000) {//regmember
            const args = new regmemberAction();
            args.unpack(actionData);
            mycontract.regmember(args.account!,args.full_name,args.email_hash,args.tier);
        }
		if (action == 0xBAA6AE49523AAE00) {//renewmember
            const args = new renewmemberAction();
            args.unpack(actionData);
            mycontract.renewmember(args.account!);
        }
		if (action == 0xD559792A4755C000) {//upgrmember
            const args = new upgrmemberAction();
            args.unpack(actionData);
            mycontract.upgrmember(args.account!,args.new_tier);
        }
		if (action == 0xD5532548EAB80000) {//updmember
            const args = new updmemberAction();
            args.unpack(actionData);
            mycontract.updmember(args.account!,args.full_name,args.email_hash);
        }
		if (action == 0xDAAEE5FA4A91D570) {//verifymember
            const args = new verifymemberAction();
            args.unpack(actionData);
            mycontract.verifymember(args.account!);
        }
		if (action == 0xBAA54DAA4A91D570) {//removemember
            const args = new removememberAction();
            args.unpack(actionData);
            mycontract.removemember(args.account!);
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
