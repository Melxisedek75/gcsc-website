import * as _chain from "as-chain";
import {
    Contract, Table, TableStore, Name, Asset, Symbol,
    check, requireAuth, isAccount, requireRecipient, EMPTY_NAME,
} from "proton-tsc";

// ─── Tables ───────────────────────────────────────────────────────────────────



class CurrencyStatsDB extends _chain.MultiIndex<CurrencyStats> {

}

@table("stat", nocodegen)

class CurrencyStats implements _chain.MultiIndexValue {
    
    constructor(
        public supply:     Asset = new Asset(),
        public max_supply: Asset = new Asset(),
        public issuer:     Name  = EMPTY_NAME
    ) {  }

    @primary
    get primary(): u64 { return this.supply.symbol.code(); }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.supply);
        enc.pack(this.max_supply);
        enc.pack(this.issuer);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Asset();
            dec.unpack(obj);
            this.supply = obj;
        }
        
        {
            let obj = new Asset();
            dec.unpack(obj);
            this.max_supply = obj;
        }
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.issuer = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.supply.getSize();
        size += this.max_supply.getSize();
        size += this.issuer.getSize();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xC64D900000000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return CurrencyStats.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return CurrencyStats.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): CurrencyStatsDB {
        return new CurrencyStatsDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class AccountDB extends _chain.MultiIndex<Account> {

}

@table("accounts", nocodegen)

class Account implements _chain.MultiIndexValue {
    
    constructor(
        public balance: Asset = new Asset()
    ) {  }

    @primary
    get primary(): u64 { return this.balance.symbol.code(); }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.balance);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Asset();
            dec.unpack(obj);
            this.balance = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.balance.getSize();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x32114D4F38000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Account.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Account.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): AccountDB {
        return new AccountDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}

// ─── Contract ─────────────────────────────────────────────────────────────────

@contract
class gcscbuild11 extends Contract {

    @action("create")
    create(issuer: Name, maximum_supply: Asset): void {
        requireAuth(this.receiver);
        check(maximum_supply.symbol.isValid(), "invalid symbol name");
        check(maximum_supply.isValid(),         "invalid supply");
        check(maximum_supply.amount > 0,        "max-supply must be positive");

        const symCode   = maximum_supply.symbol.code();
        const statTable = new TableStore<CurrencyStats>(this.receiver, new Name(symCode));
        check(!statTable.exists(symCode), "token with symbol already exists");
        statTable.store(
            new CurrencyStats(new Asset(0, maximum_supply.symbol), maximum_supply, issuer),
            this.receiver
        );
    }

    @action("issue")
    issue(to: Name, quantity: Asset, memo: string): void {
        check(quantity.symbol.isValid(), "invalid symbol name");
        check(memo.length <= 256,        "memo has more than 256 bytes");

        const symCode   = quantity.symbol.code();
        const statTable = new TableStore<CurrencyStats>(this.receiver, new Name(symCode));
        const stat      = statTable.requireGet(symCode, "token does not exist, create it first");

        requireAuth(stat.issuer);
        check(quantity.isValid(),  "invalid quantity");
        check(quantity.amount > 0, "must issue positive quantity");
        check(quantity.symbol.code() == stat.max_supply.symbol.code(), "symbol precision mismatch");
        check(
            quantity.amount <= stat.max_supply.amount - stat.supply.amount,
            "quantity exceeds available supply"
        );

        stat.supply = Asset.add(stat.supply, quantity);
        statTable.update(stat, stat.issuer);
        this.addBalance(stat.issuer, quantity, stat.issuer);

        if (to != stat.issuer) {
            this.subBalance(stat.issuer, quantity);
            this.addBalance(to, quantity, stat.issuer);
        }
    }

    @action("retire")
    retire(quantity: Asset, memo: string): void {
        check(quantity.symbol.isValid(), "invalid symbol name");
        check(memo.length <= 256,        "memo has more than 256 bytes");

        const symCode   = quantity.symbol.code();
        const statTable = new TableStore<CurrencyStats>(this.receiver, new Name(symCode));
        const stat      = statTable.requireGet(symCode, "token does not exist");

        requireAuth(stat.issuer);
        check(quantity.isValid(),  "invalid quantity");
        check(quantity.amount > 0, "must retire positive quantity");

        stat.supply = Asset.sub(stat.supply, quantity);
        statTable.update(stat, stat.issuer);
        this.subBalance(stat.issuer, quantity);
    }

    @action("transfer", notify)
    transfer(from: Name, to: Name, quantity: Asset, memo: string): void {
        check(from != to,          "cannot transfer to self");
        requireAuth(from);
        check(isAccount(to),       "to account does not exist");
        check(memo.length <= 256,  "memo has more than 256 bytes");
        check(quantity.isValid(),  "invalid quantity");
        check(quantity.amount > 0, "must transfer positive quantity");

        const symCode   = quantity.symbol.code();
        const statTable = new TableStore<CurrencyStats>(this.receiver, new Name(symCode));
        const stat      = statTable.requireGet(symCode, "token does not exist");
        check(quantity.symbol.code() == stat.supply.symbol.code(), "symbol precision mismatch");

        requireRecipient(from);
        requireRecipient(to);

        this.subBalance(from, quantity);
        this.addBalance(to, quantity, from);
    }

    @action("open")
    open(owner: Name, symbol: Symbol, ram_payer: Name): void {
        requireAuth(ram_payer);
        check(isAccount(owner), "owner account does not exist");

        const symCode   = symbol.code();
        const statTable = new TableStore<CurrencyStats>(this.receiver, new Name(symCode));
        statTable.requireGet(symCode, "symbol does not exist");

        const acctTable = new TableStore<Account>(this.receiver, owner);
        if (!acctTable.exists(symCode)) {
            acctTable.store(new Account(new Asset(0, symbol)), ram_payer);
        }
    }

    @action("close")
    close(owner: Name, symbol: Symbol): void {
        requireAuth(owner);
        const acctTable = new TableStore<Account>(this.receiver, owner);
        const acnt      = acctTable.requireGet(symbol.code(), "balance row already deleted or never existed");
        check(acnt.balance.amount == 0, "cannot close because the balance is not zero");
        acctTable.remove(acnt);
    }

    // ── internal helpers ──────────────────────────────────────────────────────

    subBalance(owner: Name, value: Asset): void {
        const acctTable = new TableStore<Account>(this.receiver, owner);
        const row       = acctTable.requireGet(value.symbol.code(), "no balance object found");
        check(row.balance.amount >= value.amount, "overdrawn balance");
        row.balance = Asset.sub(row.balance, value);
        acctTable.update(row, owner);
    }

    addBalance(owner: Name, value: Asset, ramPayer: Name): void {
        const acctTable = new TableStore<Account>(this.receiver, owner);
        const row       = acctTable.get(value.symbol.code());
        if (!row) {
            acctTable.store(new Account(value), ramPayer);
        } else {
            row.balance = Asset.add(row.balance, value);
            acctTable.update(row, ramPayer);
        }
    }
}


class createAction implements _chain.Packer {
    constructor (
        public issuer: _chain.Name | null = null,
        public maximum_supply: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.issuer!);
        enc.pack(this.maximum_supply!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.issuer! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.maximum_supply! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.issuer!.getSize();
        size += this.maximum_supply!.getSize();
        return size;
    }
}

class issueAction implements _chain.Packer {
    constructor (
        public to: _chain.Name | null = null,
        public quantity: _chain.Asset | null = null,
        public memo: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.to!);
        enc.pack(this.quantity!);
        enc.packString(this.memo);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.to! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.quantity! = obj;
        }
        this.memo = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.to!.getSize();
        size += this.quantity!.getSize();
        size += _chain.Utils.calcPackedStringLength(this.memo);
        return size;
    }
}

class retireAction implements _chain.Packer {
    constructor (
        public quantity: _chain.Asset | null = null,
        public memo: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.quantity!);
        enc.packString(this.memo);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.quantity! = obj;
        }
        this.memo = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.quantity!.getSize();
        size += _chain.Utils.calcPackedStringLength(this.memo);
        return size;
    }
}

class transferAction implements _chain.Packer {
    constructor (
        public from: _chain.Name | null = null,
        public to: _chain.Name | null = null,
        public quantity: _chain.Asset | null = null,
        public memo: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.from!);
        enc.pack(this.to!);
        enc.pack(this.quantity!);
        enc.packString(this.memo);
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
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.to! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.quantity! = obj;
        }
        this.memo = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.from!.getSize();
        size += this.to!.getSize();
        size += this.quantity!.getSize();
        size += _chain.Utils.calcPackedStringLength(this.memo);
        return size;
    }
}

class openAction implements _chain.Packer {
    constructor (
        public owner: _chain.Name | null = null,
        public symbol: _chain.Symbol | null = null,
        public ram_payer: _chain.Name | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.owner!);
        enc.pack(this.symbol!);
        enc.pack(this.ram_payer!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.owner! = obj;
        }
        
        {
            let obj = new _chain.Symbol();
            dec.unpack(obj);
            this.symbol! = obj;
        }
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.ram_payer! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.owner!.getSize();
        size += this.symbol!.getSize();
        size += this.ram_payer!.getSize();
        return size;
    }
}

class closeAction implements _chain.Packer {
    constructor (
        public owner: _chain.Name | null = null,
        public symbol: _chain.Symbol | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.owner!);
        enc.pack(this.symbol!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.owner! = obj;
        }
        
        {
            let obj = new _chain.Symbol();
            dec.unpack(obj);
            this.symbol! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.owner!.getSize();
        size += this.symbol!.getSize();
        return size;
    }
}

export function apply(receiver: u64, firstReceiver: u64, action: u64): void {
	const _receiver = new _chain.Name(receiver);
	const _firstReceiver = new _chain.Name(firstReceiver);
	const _action = new _chain.Name(action);

	const mycontract = new gcscbuild11(_receiver, _firstReceiver, _action);
	const actionData = _chain.readActionData();

	if (receiver == firstReceiver) {
		if (action == 0x45D46CA800000000) {//create
            const args = new createAction();
            args.unpack(actionData);
            mycontract.create(args.issuer!,args.maximum_supply!);
        }
		if (action == 0x7631A50000000000) {//issue
            const args = new issueAction();
            args.unpack(actionData);
            mycontract.issue(args.to!,args.quantity!,args.memo);
        }
		if (action == 0xBAB2EBA800000000) {//retire
            const args = new retireAction();
            args.unpack(actionData);
            mycontract.retire(args.quantity!,args.memo);
        }
		
		if (action == 0xA555300000000000) {//open
            const args = new openAction();
            args.unpack(actionData);
            mycontract.open(args.owner!,args.symbol!,args.ram_payer!);
        }
		if (action == 0x4469850000000000) {//close
            const args = new closeAction();
            args.unpack(actionData);
            mycontract.close(args.owner!,args.symbol!);
        }
	}
  
	if (receiver != firstReceiver) {
		if (action == 0xCDCD3C2D57000000) {//transfer
            const args = new transferAction();
            args.unpack(actionData);
            mycontract.transfer(args.from!,args.to!,args.quantity!,args.memo);
        }
	}
	return;
}
