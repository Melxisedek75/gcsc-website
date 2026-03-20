import {
    Contract, Table, TableStore, Name, Asset, Symbol,
    check, requireAuth, isAccount, requireRecipient, EMPTY_NAME,
} from "proton-tsc";

// ─── Tables ───────────────────────────────────────────────────────────────────

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

// ─── Contract ─────────────────────────────────────────────────────────────────

@contract
class gcsctoken111 extends Contract {

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
