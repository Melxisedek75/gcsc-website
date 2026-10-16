import * as _chain from "as-chain";
/**
 * gcscinsure11 – GCSC Insurance Contract
 *
 * Members purchase insurance policies and file claims.
 *
 * Policy types : 0=HEALTH | 1=LIFE | 2=PROPERTY | 3=GENERAL
 * Policy status: 0=ACTIVE | 1=EXPIRED | 2=CANCELLED
 * Claim status : 0=FILED | 1=UNDER_REVIEW | 2=APPROVED | 3=REJECTED | 4=PAID
 *
 * Premium flow : policyholder gives gcscinsure11@eosio.code permission,
 *                then calls paypremium(). Tokens pulled inline.
 * Claim flow   : file claim → admin reviews → admin approves/rejects → auto-pay on approval.
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

// ─── Constants ────────────────────────────────────────────────────────────────

const PTYPE_HEALTH:   u8 = 0;
const PTYPE_LIFE:     u8 = 1;
const PTYPE_PROPERTY: u8 = 2;
const PTYPE_GENERAL:  u8 = 3;

const PSTAT_ACTIVE:    u8 = 0;
const PSTAT_EXPIRED:   u8 = 1;
const PSTAT_CANCELLED: u8 = 2;

const CSTAT_FILED:      u8 = 0;
const CSTAT_REVIEWING:  u8 = 1;
const CSTAT_APPROVED:   u8 = 2;
const CSTAT_REJECTED:   u8 = 3;
const CSTAT_PAID:       u8 = 4;

// ─── Tables ───────────────────────────────────────────────────────────────────



class PolicyDB extends _chain.MultiIndex<Policy> {
    get by_holderDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[0];
    }
    get by_statusDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[1];
    }

    
    updateBy_holder(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

    
    updateBy_status(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

}

@table("policies", nocodegen)

class Policy implements _chain.MultiIndexValue {
    
    constructor(
        public id:             u64  = 0,
        public holder:         Name = EMPTY_NAME,
        public policy_type:    u8   = PTYPE_GENERAL,
        public coverage:       i64  = 0,        // max payout per claim
        public premium:        i64  = 0,        // periodic premium amount
        public period_secs:    u32  = 2_592_000, // payment interval (30 days)
        public status:         u8   = PSTAT_ACTIVE,
        public start_date:     u32  = 0,
        public end_date:       u32  = 0,
        public next_due:       u32  = 0,
        public total_paid:     i64  = 0,
        public active_claims:  u32  = 0
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_holder(): u64 { return this.holder.N; }
    set by_holder(v: u64) { this.holder = new Name(v); }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.pack(this.holder);
        enc.packNumber<u8>(this.policy_type);
        enc.packNumber<i64>(this.coverage);
        enc.packNumber<i64>(this.premium);
        enc.packNumber<u32>(this.period_secs);
        enc.packNumber<u8>(this.status);
        enc.packNumber<u32>(this.start_date);
        enc.packNumber<u32>(this.end_date);
        enc.packNumber<u32>(this.next_due);
        enc.packNumber<i64>(this.total_paid);
        enc.packNumber<u32>(this.active_claims);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u64>();
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.holder = obj;
        }
        this.policy_type = dec.unpackNumber<u8>();
        this.coverage = dec.unpackNumber<i64>();
        this.premium = dec.unpackNumber<i64>();
        this.period_secs = dec.unpackNumber<u32>();
        this.status = dec.unpackNumber<u8>();
        this.start_date = dec.unpackNumber<u32>();
        this.end_date = dec.unpackNumber<u32>();
        this.next_due = dec.unpackNumber<u32>();
        this.total_paid = dec.unpackNumber<i64>();
        this.active_claims = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += this.holder.getSize();
        size += sizeof<u8>();
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<u32>();
        size += sizeof<u8>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<i64>();
        size += sizeof<u32>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xAD22E43958000000);
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
        return Policy.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Policy.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        switch (i) {
            case 0: {
                return _chain.newSecondaryValue_u64(this.by_holder);
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
                this.by_holder = _value;
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): PolicyDB {
        return new PolicyDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class ClaimDB extends _chain.MultiIndex<Claim> {
    get by_policyDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[0];
    }
    get by_claimantDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[1];
    }
    get by_statusDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[2];
    }

    
    updateBy_policy(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

    
    updateBy_claimant(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

    
    updateBy_status(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

}

@table("claims", nocodegen)

class Claim implements _chain.MultiIndexValue {
    
    constructor(
        public id:           u64    = 0,
        public policy_id:    u64    = 0,
        public claimant:     Name   = EMPTY_NAME,
        public amount:       i64    = 0,
        public description:  string = "",
        public evidence:     string = "",   // IPFS hash or reference
        public status:       u8     = CSTAT_FILED,
        public filed_at:     u32    = 0,
        public resolved_at:  u32    = 0,
        public reject_reason:string = ""
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_policy(): u64 { return this.policy_id; }
    set by_policy(v: u64) { this.policy_id = v; }

    @secondary
    get by_claimant(): u64 { return this.claimant.N; }
    set by_claimant(v: u64) { this.claimant = new Name(v); }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.packNumber<u64>(this.policy_id);
        enc.pack(this.claimant);
        enc.packNumber<i64>(this.amount);
        enc.packString(this.description);
        enc.packString(this.evidence);
        enc.packNumber<u8>(this.status);
        enc.packNumber<u32>(this.filed_at);
        enc.packNumber<u32>(this.resolved_at);
        enc.packString(this.reject_reason);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u64>();
        this.policy_id = dec.unpackNumber<u64>();
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.claimant = obj;
        }
        this.amount = dec.unpackNumber<i64>();
        this.description = dec.unpackString();
        this.evidence = dec.unpackString();
        this.status = dec.unpackNumber<u8>();
        this.filed_at = dec.unpackNumber<u32>();
        this.resolved_at = dec.unpackNumber<u32>();
        this.reject_reason = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += sizeof<u64>();
        size += this.claimant.getSize();
        size += sizeof<i64>();
        size += _chain.Utils.calcPackedStringLength(this.description);
        size += _chain.Utils.calcPackedStringLength(this.evidence);
        size += sizeof<u8>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += _chain.Utils.calcPackedStringLength(this.reject_reason);
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x444CE96000000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
            new _chain.IDX64(code.N, scope.N, idxTableBase + 0, 0),
            new _chain.IDX64(code.N, scope.N, idxTableBase + 1, 1),
            new _chain.IDX64(code.N, scope.N, idxTableBase + 2, 2),
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Claim.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Claim.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        switch (i) {
            case 0: {
                return _chain.newSecondaryValue_u64(this.by_policy);
                break;
            }
            case 1: {
                return _chain.newSecondaryValue_u64(this.by_claimant);
                break;
            }
            case 2: {
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
                this.by_policy = _value;
                break;
            }
            case 1: {
                let _value = _chain.getSecondaryValue_u64(value);
                this.by_claimant = _value;
                break;
            }
            case 2: {
                let _value = _chain.getSecondaryValue_u64(value);
                this.by_status = _value;
                break;
            }
            default:
                _chain.assert(false, "bad db index!");
        }
    }


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): ClaimDB {
        return new ClaimDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class InsurancePoolDB extends _chain.MultiIndex<InsurancePool> {

}

@table("pool", nocodegen)

class InsurancePool implements _chain.MultiIndexValue {
    
    constructor(
        public total_premiums:   i64 = 0,
        public total_payouts:    i64 = 0,
        public reserve:          i64 = 0,   // admin-deposited reserve
        public pending_claims:   i64 = 0    // total amount of filed claims
    ) {  }

    @primary
    get primary(): u64 { return 0; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<i64>(this.total_premiums);
        enc.packNumber<i64>(this.total_payouts);
        enc.packNumber<i64>(this.reserve);
        enc.packNumber<i64>(this.pending_claims);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.total_premiums = dec.unpackNumber<i64>();
        this.total_payouts = dec.unpackNumber<i64>();
        this.reserve = dec.unpackNumber<i64>();
        this.pending_claims = dec.unpackNumber<i64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<i64>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xAD29100000000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return InsurancePool.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return InsurancePool.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): InsurancePoolDB {
        return new InsurancePoolDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class InsuranceProductDB extends _chain.MultiIndex<InsuranceProduct> {

}

@table("products", nocodegen)

class InsuranceProduct implements _chain.MultiIndexValue {
    
    constructor(
        public id:           u8   = 0,   // policy_type id
        public name:         string = "",
        public min_premium:  i64   = 0,
        public max_coverage: i64   = 0,
        public min_term:     u32   = 0,  // minimum policy duration in seconds
        public available:    bool  = true
    ) {  }

    @primary
    get primary(): u64 { return <u64>this.id; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u8>(this.id);
        enc.packString(this.name);
        enc.packNumber<i64>(this.min_premium);
        enc.packNumber<i64>(this.max_coverage);
        enc.packNumber<u32>(this.min_term);
        enc.packNumber<bool>(this.available);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u8>();
        this.name = dec.unpackString();
        this.min_premium = dec.unpackNumber<i64>();
        this.max_coverage = dec.unpackNumber<i64>();
        this.min_term = dec.unpackNumber<u32>();
        this.available = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u8>();
        size += _chain.Utils.calcPackedStringLength(this.name);
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<u32>();
        size += sizeof<bool>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xADE89D2338000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return InsuranceProduct.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return InsuranceProduct.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): InsuranceProductDB {
        return new InsuranceProductDB(code, scope, this.tableName, this.tableIndexes(code, scope));
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
        public reserve_ratio:    u32  = 2000,   // 20% of premiums kept as reserve (bps)
        public paused:           bool = false
    ) {  }

    @primary
    get primary(): u64 { return 0; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin);
        enc.pack(this.token_contract);
        enc.packNumber<u64>(this.token_symbol_raw);
        enc.packNumber<u32>(this.reserve_ratio);
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
        this.reserve_ratio = dec.unpackNumber<u32>();
        this.paused = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin.getSize();
        size += this.token_contract.getSize();
        size += sizeof<u64>();
        size += sizeof<u32>();
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
class gcscinsure11 extends Contract {

    policiesTable:  TableStore<Policy>          = new TableStore<Policy>(this.receiver);
    claimsTable:    TableStore<Claim>           = new TableStore<Claim>(this.receiver);
    poolTable:      TableStore<InsurancePool>   = new TableStore<InsurancePool>(this.receiver);
    productsTable:  TableStore<InsuranceProduct>= new TableStore<InsuranceProduct>(this.receiver);
    configTable:    TableStore<Config>          = new TableStore<Config>(this.receiver);

    // ── setconfig ─────────────────────────────────────────────────────────────
    @action("setconfig")
    setconfig(
        admin:          Name,
        token_contract: Name,
        token_symbol:   Symbol,
        reserve_ratio:  u32
    ): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin == EMPTY_NAME ? this.receiver : cfg.admin);

        check(isAccount(admin),          "admin does not exist");
        check(isAccount(token_contract), "token contract does not exist");
        check(reserve_ratio <= 10000,    "reserve ratio cannot exceed 100%");

        cfg.admin            = admin;
        cfg.token_contract   = token_contract;
        cfg.token_symbol_raw = token_symbol.value;
        cfg.reserve_ratio    = reserve_ratio;
        this.configTable.set(cfg, this.receiver);
    }

    // ── setproduct ────────────────────────────────────────────────────────────
    @action("setproduct")
    setproduct(
        policy_type:  u8,
        name:         string,
        min_premium:  Asset,
        max_coverage: Asset,
        min_term:     u32,
        available:    bool
    ): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(policy_type <= PTYPE_GENERAL, "invalid policy type");
        check(name.length > 0,             "name required");
        check(min_premium.amount > 0,      "min premium must be positive");
        check(max_coverage.amount > 0,     "max coverage must be positive");
        check(min_term > 0,                "min term must be positive");

        const row = new InsuranceProduct(
            policy_type, name, min_premium.amount, max_coverage.amount, min_term, available
        );
        this.productsTable.set(row, this.receiver);
    }

    // ── createpolicy ──────────────────────────────────────────────────────────
    @action("createpolicy")
    createpolicy(
        holder:      Name,
        policy_type: u8,
        coverage:    Asset,
        premium:     Asset,
        term_secs:   u32
    ): void {
        requireAuth(holder);

        const cfg = this.getConfig();
        check(!cfg.paused,          "contract is paused");
        check(isAccount(holder),    "holder does not exist");
        check(policy_type <= PTYPE_GENERAL, "invalid policy type");
        check(coverage.isValid() && coverage.amount > 0, "invalid coverage");
        check(premium.isValid()  && premium.amount  > 0, "invalid premium");
        check(coverage.symbol.value == cfg.token_symbol_raw, "wrong coverage symbol");
        check(premium.symbol.value  == cfg.token_symbol_raw, "wrong premium symbol");
        check(term_secs > 0,        "term must be positive");

        const product = this.productsTable.requireGet(<u64>policy_type, "policy type not configured");
        check(product.available,                       "policy type is not available");
        check(premium.amount  >= product.min_premium,  "premium below minimum");
        check(coverage.amount <= product.max_coverage, "coverage exceeds maximum");
        check(term_secs >= product.min_term,            "term below minimum");

        // Pull first premium payment
        sendTransfer(cfg.token_contract, holder, this.receiver, premium, "initial premium");

        this.updatePool(premium.amount, 0, 0, cfg);

        const now  = <u32>currentTimeSec();
        const id   = this.policiesTable.availablePrimaryKey;
        this.policiesTable.store(
            new Policy(
                id, holder, policy_type, coverage.amount, premium.amount,
                2_592_000,  // 30-day period
                PSTAT_ACTIVE, now, now + term_secs, now + 2_592_000,
                premium.amount, 0
            ),
            holder
        );
    }

    // ── paypremium ────────────────────────────────────────────────────────────
    @action("paypremium")
    paypremium(holder: Name, policy_id: u64): void {
        requireAuth(holder);

        const cfg    = this.getConfig();
        check(!cfg.paused, "contract is paused");
        const policy = this.policiesTable.requireGet(policy_id, "policy not found");
        check(policy.holder  == holder,       "not your policy");
        check(policy.status  == PSTAT_ACTIVE, "policy is not active");

        const now = <u32>currentTimeSec();
        check(now >= policy.next_due - 86_400, "premium not due yet (within 1 day grace)");

        // Expire if overdue by more than a grace period (7 days)
        if (now > policy.next_due + 604_800) {
            policy.status = PSTAT_EXPIRED;
            this.policiesTable.update(policy, holder);
            check(false, "policy has expired due to missed premium");
        }

        const sym = Symbol.fromU64(cfg.token_symbol_raw);
        sendTransfer(cfg.token_contract, holder, this.receiver, new Asset(policy.premium, sym), "premium payment");

        policy.next_due   += policy.period_secs;
        policy.total_paid += policy.premium;
        this.policiesTable.update(policy, holder);

        this.updatePool(policy.premium, 0, 0, cfg);
    }

    // ── fileclaim ─────────────────────────────────────────────────────────────
    @action("fileclaim")
    fileclaim(
        claimant:    Name,
        policy_id:   u64,
        amount:      Asset,
        description: string,
        evidence:    string
    ): void {
        requireAuth(claimant);

        const cfg    = this.getConfig();
        check(!cfg.paused,            "contract is paused");
        const policy = this.policiesTable.requireGet(policy_id, "policy not found");
        check(policy.holder == claimant,     "not your policy");
        check(policy.status == PSTAT_ACTIVE, "policy is not active");
        check(amount.isValid() && amount.amount > 0, "invalid claim amount");
        check(amount.amount <= policy.coverage,      "claim exceeds coverage limit");
        check(amount.symbol.value == cfg.token_symbol_raw, "wrong symbol");
        check(description.length > 0,        "description required");
        check(evidence.length > 0,           "evidence reference required");

        const id = this.claimsTable.availablePrimaryKey;
        this.claimsTable.store(
            new Claim(id, policy_id, claimant, amount.amount, description, evidence,
                      CSTAT_FILED, <u32>currentTimeSec(), 0, ""),
            claimant
        );

        policy.active_claims += 1;
        this.policiesTable.update(policy, this.receiver);

        const pool             = this.getPool();
        pool.pending_claims   += amount.amount;
        this.poolTable.set(pool, this.receiver);
    }

    // ── reviewclaim ───────────────────────────────────────────────────────────
    @action("reviewclaim")
    reviewclaim(claim_id: u64): void {
        const cfg   = this.getConfig();
        requireAuth(cfg.admin);
        const claim = this.claimsTable.requireGet(claim_id, "claim not found");
        check(claim.status == CSTAT_FILED, "claim is not in filed status");
        claim.status = CSTAT_REVIEWING;
        this.claimsTable.update(claim, this.receiver);
    }

    // ── processclaim ──────────────────────────────────────────────────────────
    @action("processclaim")
    processclaim(claim_id: u64, approve: bool, reject_reason: string): void {
        const cfg   = this.getConfig();
        requireAuth(cfg.admin);
        const claim = this.claimsTable.requireGet(claim_id, "claim not found");
        check(
            claim.status == CSTAT_FILED || claim.status == CSTAT_REVIEWING,
            "claim cannot be processed in current status"
        );

        const now  = <u32>currentTimeSec();
        const pool = this.getPool();

        if (approve) {
            check(claim.amount <= pool.total_premiums + pool.reserve - pool.total_payouts,
                  "insufficient pool funds");

            const policy = this.policiesTable.requireGet(claim.policy_id, "policy not found");
            const sym    = Symbol.fromU64(cfg.token_symbol_raw);

            sendTransfer(cfg.token_contract, this.receiver, claim.claimant,
                         new Asset(claim.amount, sym), "insurance claim payout");

            pool.total_payouts  += claim.amount;
            pool.pending_claims  = pool.pending_claims > claim.amount
                ? pool.pending_claims - claim.amount : 0;

            claim.status      = CSTAT_PAID;
            claim.resolved_at = now;

            policy.active_claims = policy.active_claims > 0 ? policy.active_claims - 1 : 0;
            this.policiesTable.update(policy, this.receiver);
        } else {
            check(reject_reason.length > 0, "reject reason required");
            claim.status        = CSTAT_REJECTED;
            claim.resolved_at   = now;
            claim.reject_reason = reject_reason;

            pool.pending_claims = pool.pending_claims > claim.amount
                ? pool.pending_claims - claim.amount : 0;

            const policy = this.policiesTable.requireGet(claim.policy_id, "policy not found");
            policy.active_claims = policy.active_claims > 0 ? policy.active_claims - 1 : 0;
            this.policiesTable.update(policy, this.receiver);
        }

        this.claimsTable.update(claim, this.receiver);
        this.poolTable.set(pool, this.receiver);
    }

    // ── cancelpolicy ──────────────────────────────────────────────────────────
    @action("cancelpolicy")
    cancelpolicy(holder: Name, policy_id: u64): void {
        requireAuth(holder);
        const policy = this.policiesTable.requireGet(policy_id, "policy not found");
        check(policy.holder == holder,        "not your policy");
        check(policy.status == PSTAT_ACTIVE,  "policy is not active");
        check(policy.active_claims == 0,      "cannot cancel with pending claims");
        policy.status = PSTAT_CANCELLED;
        this.policiesTable.update(policy, holder);
    }

    // ── addreserve ────────────────────────────────────────────────────────────
    @action("addreserve")
    addreserve(from: Name, amount: Asset): void {
        requireAuth(from);
        const cfg = this.getConfig();
        check(from == cfg.admin, "only admin can add reserves");
        check(amount.isValid() && amount.amount > 0, "invalid amount");
        check(amount.symbol.value == cfg.token_symbol_raw, "wrong symbol");

        sendTransfer(cfg.token_contract, from, this.receiver, amount, "reserve deposit");
        this.updatePool(0, amount.amount, 0, cfg);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    updatePool(premium: i64, reserve: i64, payout: i64, cfg: Config): void {
        const pool             = this.getPool();
        pool.total_premiums   += premium;
        pool.reserve          += reserve;
        pool.total_payouts    += payout;
        this.poolTable.set(pool, this.receiver);
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

    getPool(): InsurancePool {
        let pool = this.poolTable.get(0);
        if (!pool) {
            pool = new InsurancePool();
            this.poolTable.store(pool, this.receiver);
        }
        return pool;
    }
}


class setconfigAction implements _chain.Packer {
    constructor (
        public admin: _chain.Name | null = null,
        public token_contract: _chain.Name | null = null,
        public token_symbol: _chain.Symbol | null = null,
        public reserve_ratio: u32 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin!);
        enc.pack(this.token_contract!);
        enc.pack(this.token_symbol!);
        enc.packNumber<u32>(this.reserve_ratio);
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
        this.reserve_ratio = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin!.getSize();
        size += this.token_contract!.getSize();
        size += this.token_symbol!.getSize();
        size += sizeof<u32>();
        return size;
    }
}

class setproductAction implements _chain.Packer {
    constructor (
        public policy_type: u8 = 0,
        public name: string = "",
        public min_premium: _chain.Asset | null = null,
        public max_coverage: _chain.Asset | null = null,
        public min_term: u32 = 0,
        public available: bool = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u8>(this.policy_type);
        enc.packString(this.name);
        enc.pack(this.min_premium!);
        enc.pack(this.max_coverage!);
        enc.packNumber<u32>(this.min_term);
        enc.packNumber<bool>(this.available);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.policy_type = dec.unpackNumber<u8>();
        this.name = dec.unpackString();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.min_premium! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.max_coverage! = obj;
        }
        this.min_term = dec.unpackNumber<u32>();
        this.available = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u8>();
        size += _chain.Utils.calcPackedStringLength(this.name);
        size += this.min_premium!.getSize();
        size += this.max_coverage!.getSize();
        size += sizeof<u32>();
        size += sizeof<bool>();
        return size;
    }
}

class createpolicyAction implements _chain.Packer {
    constructor (
        public holder: _chain.Name | null = null,
        public policy_type: u8 = 0,
        public coverage: _chain.Asset | null = null,
        public premium: _chain.Asset | null = null,
        public term_secs: u32 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.holder!);
        enc.packNumber<u8>(this.policy_type);
        enc.pack(this.coverage!);
        enc.pack(this.premium!);
        enc.packNumber<u32>(this.term_secs);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.holder! = obj;
        }
        this.policy_type = dec.unpackNumber<u8>();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.coverage! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.premium! = obj;
        }
        this.term_secs = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.holder!.getSize();
        size += sizeof<u8>();
        size += this.coverage!.getSize();
        size += this.premium!.getSize();
        size += sizeof<u32>();
        return size;
    }
}

class paypremiumAction implements _chain.Packer {
    constructor (
        public holder: _chain.Name | null = null,
        public policy_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.holder!);
        enc.packNumber<u64>(this.policy_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.holder! = obj;
        }
        this.policy_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.holder!.getSize();
        size += sizeof<u64>();
        return size;
    }
}

class fileclaimAction implements _chain.Packer {
    constructor (
        public claimant: _chain.Name | null = null,
        public policy_id: u64 = 0,
        public amount: _chain.Asset | null = null,
        public description: string = "",
        public evidence: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.claimant!);
        enc.packNumber<u64>(this.policy_id);
        enc.pack(this.amount!);
        enc.packString(this.description);
        enc.packString(this.evidence);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.claimant! = obj;
        }
        this.policy_id = dec.unpackNumber<u64>();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.amount! = obj;
        }
        this.description = dec.unpackString();
        this.evidence = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.claimant!.getSize();
        size += sizeof<u64>();
        size += this.amount!.getSize();
        size += _chain.Utils.calcPackedStringLength(this.description);
        size += _chain.Utils.calcPackedStringLength(this.evidence);
        return size;
    }
}

class reviewclaimAction implements _chain.Packer {
    constructor (
        public claim_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.claim_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.claim_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        return size;
    }
}

class processclaimAction implements _chain.Packer {
    constructor (
        public claim_id: u64 = 0,
        public approve: bool = 0,
        public reject_reason: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.claim_id);
        enc.packNumber<bool>(this.approve);
        enc.packString(this.reject_reason);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.claim_id = dec.unpackNumber<u64>();
        this.approve = dec.unpackNumber<bool>();
        this.reject_reason = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += sizeof<bool>();
        size += _chain.Utils.calcPackedStringLength(this.reject_reason);
        return size;
    }
}

class cancelpolicyAction implements _chain.Packer {
    constructor (
        public holder: _chain.Name | null = null,
        public policy_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.holder!);
        enc.packNumber<u64>(this.policy_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.holder! = obj;
        }
        this.policy_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.holder!.getSize();
        size += sizeof<u64>();
        return size;
    }
}

class addreserveAction implements _chain.Packer {
    constructor (
        public from: _chain.Name | null = null,
        public amount: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.from!);
        enc.pack(this.amount!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.from! = obj;
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
        size += this.from!.getSize();
        size += this.amount!.getSize();
        return size;
    }
}

export function apply(receiver: u64, firstReceiver: u64, action: u64): void {
	const _receiver = new _chain.Name(receiver);
	const _firstReceiver = new _chain.Name(firstReceiver);
	const _action = new _chain.Name(action);

	const mycontract = new gcscinsure11(_receiver, _firstReceiver, _action);
	const actionData = _chain.readActionData();

	if (receiver == firstReceiver) {
		if (action == 0xC2B28A4D6E600000) {//setconfig
            const args = new setconfigAction();
            args.unpack(actionData);
            mycontract.setconfig(args.admin!,args.token_contract!,args.token_symbol!,args.reserve_ratio);
        }
		if (action == 0xC2B35BD13A464000) {//setproduct
            const args = new setproductAction();
            args.unpack(actionData);
            mycontract.setproduct(args.policy_type,args.name,args.min_premium!,args.max_coverage!,args.min_term,args.available);
        }
		if (action == 0x45D46CAAB48B91E0) {//createpolicy
            const args = new createpolicyAction();
            args.unpack(actionData);
            mycontract.createpolicy(args.holder!,args.policy_type,args.coverage!,args.premium!,args.term_secs);
        }
		if (action == 0xA9BD5BAA4ED48000) {//paypremium
            const args = new paypremiumAction();
            args.unpack(actionData);
            mycontract.paypremium(args.holder!,args.policy_id);
        }
		if (action == 0x5BA2A444CE900000) {//fileclaim
            const args = new fileclaimAction();
            args.unpack(actionData);
            mycontract.fileclaim(args.claimant!,args.policy_id,args.amount!,args.description,args.evidence);
        }
		if (action == 0xBAB6E5711133A400) {//reviewclaim
            const args = new reviewclaimAction();
            args.unpack(actionData);
            mycontract.reviewclaim(args.claim_id);
        }
		if (action == 0xADE8856308899D20) {//processclaim
            const args = new processclaimAction();
            args.unpack(actionData);
            mycontract.processclaim(args.claim_id,args.approve,args.reject_reason);
        }
		if (action == 0x41A68546B48B91E0) {//cancelpolicy
            const args = new cancelpolicyAction();
            args.unpack(actionData);
            mycontract.cancelpolicy(args.holder!,args.policy_id);
        }
		if (action == 0x3253756157DA8000) {//addreserve
            const args = new addreserveAction();
            args.unpack(actionData);
            mycontract.addreserve(args.from!,args.amount!);
        }
	}
  
	if (receiver != firstReceiver) {
		
	}
	return;
}
