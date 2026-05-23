/**
 * gcscstable11 - GCST reserve-backed stablecoin contract
 *
 * Standard proton-tsc token pattern extended with authorized minters and a
 * reserve ceiling. GCST is fixed to 100,000,000.0000 maximum supply.
 */
import {
    Contract, Table, TableStore, Name, Asset, Symbol,
    check, requireAuth, hasAuth, isAccount, requireRecipient, EMPTY_NAME,
} from "proton-tsc";

const GCST_MAX_SUPPLY: i64 = 1_000_000_000_000; // 100,000,000.0000 GCST

// Tables

@table("stat")
class CurrencyStats extends Table {
    constructor(
        public supply:     Asset = new Asset(),
        public max_supply: Asset = new Asset(),
        public issuer:     Name  = EMPTY_NAME
    ) { super(); }

    @primary
    get primary(): u64 { return this.supply.symbol.code(); }
}

@table("accounts")
class Account extends Table {
    constructor(
        public balance: Asset = new Asset()
    ) { super(); }

    @primary
    get primary(): u64 { return this.balance.symbol.code(); }
}

@table("minters")
class Minter extends Table {
    constructor(
        public account: Name = EMPTY_NAME
    ) { super(); }

    @primary
    get primary(): u64 { return this.account.N; }
}

@table("reserve")
class Reserve extends Table {
    constructor(
        public id:      u64 = 0,
        public balance: i64 = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }
}

// Contract

@contract
class gcscstable11 extends Contract {

    mintersTable: TableStore<Minter>  = new TableStore<Minter>(this.receiver);
    reserveTable: TableStore<Reserve> = new TableStore<Reserve>(this.receiver);

    @action("create")
    create(issuer: Name, maximum_supply: Asset): void {
        requireAuth(this.receiver);
        check(isAccount(issuer), "issuer account does not exist");
        check(maximum_supply.symbol.isValid(), "invalid symbol name");
        check(maximum_supply.isValid(),         "invalid supply");
        check(maximum_supply.amount > 0,        "max-supply must be positive");
        check(maximum_supply.symbol.value == new Symbol("GCST", 4).value, "symbol must be 4,GCST");
        check(maximum_supply.amount == GCST_MAX_SUPPLY, "max supply must be 100000000.0000 GCST");

        const symCode   = maximum_supply.symbol.code();
        const statTable = new TableStore<CurrencyStats>(this.receiver, new Name(symCode));
        check(!statTable.exists(symCode), "token with symbol already exists");
        statTable.store(
            new CurrencyStats(new Asset(0, maximum_supply.symbol), maximum_supply, issuer),
            this.receiver
        );

        this.reserveTable.set(new Reserve(0, 0), this.receiver);
    }

    @action("addminter")
    addminter(account: Name): void {
        const stat = this.getGcstStat();
        requireAuth(stat.issuer);
        check(isAccount(account), "minter account does not exist");
        check(!this.mintersTable.exists(account.N), "minter already exists");
        this.mintersTable.store(new Minter(account), stat.issuer);
    }

    @action("removeminter")
    removeminter(account: Name): void {
        const stat = this.getGcstStat();
        requireAuth(stat.issuer);
        const minter = this.mintersTable.requireGet(account.N, "minter not found");
        this.mintersTable.remove(minter);
    }

    @action("setreserve")
    setreserve(quantity: Asset): void {
        check(quantity.symbol.isValid(), "invalid symbol name");

        const stat = this.getStat(quantity.symbol);
        requireAuth(stat.issuer);
        check(quantity.isValid(), "invalid reserve quantity");
        check(quantity.amount >= 0, "reserve cannot be negative");
        check(quantity.symbol.value == stat.max_supply.symbol.value, "symbol precision mismatch");
        check(quantity.amount <= stat.max_supply.amount, "reserve exceeds max supply");
        check(quantity.amount >= stat.supply.amount, "reserve below current supply");

        this.reserveTable.set(new Reserve(0, quantity.amount), stat.issuer);
    }

    @action("issue")
    issue(to: Name, quantity: Asset, memo: string): void {
        check(quantity.symbol.isValid(), "invalid symbol name");
        check(memo.length <= 256,        "memo has more than 256 bytes");

        const symCode   = quantity.symbol.code();
        const statTable = new TableStore<CurrencyStats>(this.receiver, new Name(symCode));
        const stat      = statTable.requireGet(symCode, "token does not exist, create it first");

        check(this.hasIssuerOrMinterAuth(stat.issuer), "missing issuer or minter authority");
        check(quantity.isValid(),  "invalid quantity");
        check(quantity.amount > 0, "must issue positive quantity");
        check(quantity.symbol.value == stat.max_supply.symbol.value, "symbol precision mismatch");
        check(
            quantity.amount <= stat.max_supply.amount - stat.supply.amount,
            "quantity exceeds available supply"
        );

        const reserve = this.getReserve();
        check(stat.supply.amount + quantity.amount <= reserve.balance, "cannot mint beyond reserves");

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

    // Internal helpers

    getGcstStat(): CurrencyStats {
        return this.getStat(new Symbol("GCST", 4));
    }

    getStat(symbol: Symbol): CurrencyStats {
        const symCode   = symbol.code();
        const statTable = new TableStore<CurrencyStats>(this.receiver, new Name(symCode));
        return statTable.requireGet(symCode, "GCST token does not exist, create it first");
    }

    getReserve(): Reserve {
        let reserve = this.reserveTable.get(0);
        if (!reserve) {
            reserve = new Reserve(0, 0);
            this.reserveTable.store(reserve, this.receiver);
        }
        return reserve;
    }

    hasIssuerOrMinterAuth(issuer: Name): bool {
        if (hasAuth(issuer)) {
            return true;
        }

        let minter = this.mintersTable.first();
        while (minter) {
            if (hasAuth(minter.account)) {
                return true;
            }
            minter = this.mintersTable.next(minter);
        }
        return false;
    }

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
