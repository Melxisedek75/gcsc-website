import * as _chain from "as-chain";
/**
 * gcsctreasry1 – GCSC Treasury Contract
 *
 * Manages collective funds with budget categories and multi-leader approval.
 *
 * Deposit flow : caller gives gcsctreasry1@eosio.code permission, then calls deposit().
 * Expense flow : any leader proposes → N-of-M leaders approve → any leader executes.
 *
 * Budget categories are string slugs (e.g. "operations", "marketing", "realty").
 * Expense status: 0=PENDING | 1=APPROVED | 2=REJECTED | 3=EXECUTED
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



class BudgetDB extends _chain.MultiIndex<Budget> {

}

@table("budgets", nocodegen)

class Budget implements _chain.MultiIndexValue {
    
    constructor(
        public id:        u64    = 0,
        public category:  string = "",
        public allocated: i64    = 0,   // raw token units
        public spent:     i64    = 0
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.packString(this.category);
        enc.packNumber<i64>(this.allocated);
        enc.packNumber<i64>(this.spent);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u64>();
        this.category = dec.unpackString();
        this.allocated = dec.unpackNumber<i64>();
        this.spent = dec.unpackNumber<i64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += _chain.Utils.calcPackedStringLength(this.category);
        size += sizeof<i64>();
        size += sizeof<i64>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x3E92C56700000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Budget.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Budget.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): BudgetDB {
        return new BudgetDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class ExpenseDB extends _chain.MultiIndex<Expense> {
    get by_statusDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[0];
    }

    
    updateBy_status(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

}

@table("expenses", nocodegen)

class Expense implements _chain.MultiIndexValue {
    
    constructor(
        public id:          u64    = 0,
        public proposer:    Name   = EMPTY_NAME,
        public recipient:   Name   = EMPTY_NAME,
        public amount:      i64    = 0,
        public category:    string = "",
        public description: string = "",
        public status:      u8     = 0,
        public approvals:   u32    = 0,
        public rejections:  u32    = 0,
        public created_at:  u32    = 0,
        public executed_at: u32    = 0
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.pack(this.proposer);
        enc.pack(this.recipient);
        enc.packNumber<i64>(this.amount);
        enc.packString(this.category);
        enc.packString(this.description);
        enc.packNumber<u8>(this.status);
        enc.packNumber<u32>(this.approvals);
        enc.packNumber<u32>(this.rejections);
        enc.packNumber<u32>(this.created_at);
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
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.recipient = obj;
        }
        this.amount = dec.unpackNumber<i64>();
        this.category = dec.unpackString();
        this.description = dec.unpackString();
        this.status = dec.unpackNumber<u8>();
        this.approvals = dec.unpackNumber<u32>();
        this.rejections = dec.unpackNumber<u32>();
        this.created_at = dec.unpackNumber<u32>();
        this.executed_at = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += this.proposer.getSize();
        size += this.recipient.getSize();
        size += sizeof<i64>();
        size += _chain.Utils.calcPackedStringLength(this.category);
        size += _chain.Utils.calcPackedStringLength(this.description);
        size += sizeof<u8>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x576AA9E158000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
            new _chain.IDX64(code.N, scope.N, idxTableBase + 0, 0),
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Expense.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Expense.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        switch (i) {
            case 0: {
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
                this.by_status = _value;
                break;
            }
            default:
                _chain.assert(false, "bad db index!");
        }
    }


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): ExpenseDB {
        return new ExpenseDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class ApprovalDB extends _chain.MultiIndex<Approval> {
    get by_expenseDB(): _chain.IDX64 {
        return <_chain.IDX64>this.idxdbs[0];
    }

    
    updateBy_expense(idxIt: _chain.SecondaryIterator, value: u64, payer: Name): void {
        let secValue = _chain.newSecondaryValue_u64(value);
        this.idxUpdate(idxIt, secValue, payer);
    }

}

@table("approvals", nocodegen)

class Approval implements _chain.MultiIndexValue {
    
    constructor(
        public id:          u64  = 0,
        public expense_id:  u64  = 0,
        public approver:    Name = EMPTY_NAME,
        public approved:    bool = false,
        public voted_at:    u32  = 0
    ) {  }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_expense(): u64 { return this.expense_id; }
    set by_expense(v: u64) { this.expense_id = v; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.id);
        enc.packNumber<u64>(this.expense_id);
        enc.pack(this.approver);
        enc.packNumber<bool>(this.approved);
        enc.packNumber<u32>(this.voted_at);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.id = dec.unpackNumber<u64>();
        this.expense_id = dec.unpackNumber<u64>();
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.approver = obj;
        }
        this.approved = dec.unpackNumber<bool>();
        this.voted_at = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += sizeof<u64>();
        size += this.approver.getSize();
        size += sizeof<bool>();
        size += sizeof<u32>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x356B7A6CD1C00000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
            new _chain.IDX64(code.N, scope.N, idxTableBase + 0, 0),
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Approval.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Approval.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        switch (i) {
            case 0: {
                return _chain.newSecondaryValue_u64(this.by_expense);
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
                this.by_expense = _value;
                break;
            }
            default:
                _chain.assert(false, "bad db index!");
        }
    }


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): ApprovalDB {
        return new ApprovalDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class LeaderDB extends _chain.MultiIndex<Leader> {

}

@table("leaders", nocodegen)

class Leader implements _chain.MultiIndexValue {
    
    constructor(
        public account: Name = EMPTY_NAME,
        public active:  bool = true
    ) {  }

    @primary
    get primary(): u64 { return this.account.N; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account);
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
        this.active = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account.getSize();
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



class ConfigDB extends _chain.MultiIndex<Config> {

}

@table("config", nocodegen)

class Config implements _chain.MultiIndexValue {
    
    constructor(
        public admin:            Name = EMPTY_NAME,
        public token_contract:   Name = EMPTY_NAME,
        public token_symbol_raw: u64  = 0,
        public approval_needed:  u32  = 2,    // min leader approvals to execute
        public total_received:   i64  = 0,
        public total_spent:      i64  = 0,
        public paused:           bool = false
    ) {  }

    @primary
    get primary(): u64 { return 0; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin);
        enc.pack(this.token_contract);
        enc.packNumber<u64>(this.token_symbol_raw);
        enc.packNumber<u32>(this.approval_needed);
        enc.packNumber<i64>(this.total_received);
        enc.packNumber<i64>(this.total_spent);
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
        this.approval_needed = dec.unpackNumber<u32>();
        this.total_received = dec.unpackNumber<i64>();
        this.total_spent = dec.unpackNumber<i64>();
        this.paused = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin.getSize();
        size += this.token_contract.getSize();
        size += sizeof<u64>();
        size += sizeof<u32>();
        size += sizeof<i64>();
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
class gcsctreasry1 extends Contract {

    budgetsTable:   TableStore<Budget>   = new TableStore<Budget>(this.receiver);
    expensesTable:  TableStore<Expense>  = new TableStore<Expense>(this.receiver);
    approvalsTable: TableStore<Approval> = new TableStore<Approval>(this.receiver);
    leadersTable:   TableStore<Leader>   = new TableStore<Leader>(this.receiver);
    configTable:    TableStore<Config>   = new TableStore<Config>(this.receiver);

    // ── setconfig ─────────────────────────────────────────────────────────────
    @action("setconfig")
    setconfig(
        admin:            Name,
        token_contract:   Name,
        token_symbol:     Symbol,
        approval_needed:  u32
    ): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin == EMPTY_NAME ? this.receiver : cfg.admin);

        check(isAccount(admin),          "admin does not exist");
        check(isAccount(token_contract), "token contract does not exist");
        check(approval_needed > 0,       "approval_needed must be > 0");

        cfg.admin            = admin;
        cfg.token_contract   = token_contract;
        cfg.token_symbol_raw = token_symbol.value;
        cfg.approval_needed  = approval_needed;
        this.configTable.set(cfg, this.receiver);
    }

    // ── addleader ─────────────────────────────────────────────────────────────
    @action("addleader")
    addleader(account: Name): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(isAccount(account),                   "account does not exist");
        check(!this.leadersTable.exists(account.N), "already a leader");
        this.leadersTable.store(new Leader(account, true), this.receiver);
    }

    // ── removeleader ──────────────────────────────────────────────────────────
    @action("removeleader")
    removeleader(account: Name): void {
        const cfg    = this.getConfig();
        requireAuth(cfg.admin);
        const leader = this.leadersTable.requireGet(account.N, "leader not found");
        this.leadersTable.remove(leader);
    }

    // ── setbudget ─────────────────────────────────────────────────────────────
    @action("setbudget")
    setbudget(category: string, allocated: Asset): void {
        const cfg = this.getConfig();
        requireAuth(cfg.admin);
        check(category.length > 0,   "category required");
        check(allocated.amount >= 0, "allocated must be non-negative");
        check(allocated.symbol.value == cfg.token_symbol_raw, "wrong symbol");

        // find existing or create new
        let found: Budget | null = null;
        let row = this.budgetsTable.first();
        while (row) {
            if (row.category == category) { found = row; break; }
            row = this.budgetsTable.next(row);
        }

        if (!found) {
            const id = this.budgetsTable.availablePrimaryKey;
            this.budgetsTable.store(new Budget(id, category, allocated.amount, 0), this.receiver);
        } else {
            check(allocated.amount >= found.spent, "cannot allocate less than already spent");
            found.allocated = allocated.amount;
            this.budgetsTable.update(found, this.receiver);
        }
    }

    // ── deposit ───────────────────────────────────────────────────────────────
    @action("deposit")
    deposit(from: Name, amount: Asset, memo: string): void {
        requireAuth(from);
        const cfg = this.getConfig();
        check(!cfg.paused,         "treasury is paused");
        check(amount.isValid(),    "invalid amount");
        check(amount.amount > 0,   "amount must be positive");
        check(amount.symbol.value == cfg.token_symbol_raw, "wrong token symbol");

        sendTransfer(cfg.token_contract, from, this.receiver, amount, memo);

        cfg.total_received += amount.amount;
        this.configTable.set(cfg, this.receiver);
    }

    // ── proposeexp ────────────────────────────────────────────────────────────
    @action("proposeexp")
    proposeexp(
        proposer:    Name,
        recipient:   Name,
        amount:      Asset,
        category:    string,
        description: string
    ): void {
        requireAuth(proposer);
        this.leadersTable.requireGet(proposer.N, "proposer is not a treasury leader");

        const cfg = this.getConfig();
        check(!cfg.paused,           "treasury is paused");
        check(isAccount(recipient),  "recipient does not exist");
        check(amount.isValid(),      "invalid amount");
        check(amount.amount > 0,     "amount must be positive");
        check(amount.symbol.value == cfg.token_symbol_raw, "wrong symbol");
        check(category.length > 0,   "category required");
        check(description.length > 0,"description required");

        // Verify budget category has enough remaining
        let budget: Budget | null = null;
        let b = this.budgetsTable.first();
        while (b) {
            if (b.category == category) { budget = b; break; }
            b = this.budgetsTable.next(b);
        }
        if (budget) {
            check(budget.spent + amount.amount <= budget.allocated, "exceeds budget allocation");
        }

        const id = this.expensesTable.availablePrimaryKey;
        this.expensesTable.store(
            new Expense(
                id, proposer, recipient, amount.amount,
                category, description, 0, 0, 0, <u32>currentTimeSec(), 0
            ),
            proposer
        );
    }

    // ── approveexp ────────────────────────────────────────────────────────────
    @action("approveexp")
    approveexp(approver: Name, expense_id: u64, approve: bool): void {
        requireAuth(approver);
        this.leadersTable.requireGet(approver.N, "approver is not a treasury leader");

        const exp = this.expensesTable.requireGet(expense_id, "expense not found");
        check(exp.status == 0, "expense is not pending");

        // Check not already voted
        let existing = this.approvalsTable.getBySecondaryU64(expense_id, 0);
        while (existing) {
            check(existing.approver != approver, "already voted on this expense");
            existing = this.approvalsTable.next(existing);
        }

        const apid = this.approvalsTable.availablePrimaryKey;
        this.approvalsTable.store(
            new Approval(apid, expense_id, approver, approve, <u32>currentTimeSec()),
            approver
        );

        if (approve) { exp.approvals  += 1; }
        else          { exp.rejections += 1; }

        const cfg = this.getConfig();
        if (exp.approvals >= cfg.approval_needed) {
            exp.status = 1; // APPROVED
        } else if (exp.rejections >= cfg.approval_needed) {
            exp.status = 2; // REJECTED
        }
        this.expensesTable.update(exp, this.receiver);
    }

    // ── executeexp ────────────────────────────────────────────────────────────
    @action("executeexp")
    executeexp(executor: Name, expense_id: u64): void {
        requireAuth(executor);
        this.leadersTable.requireGet(executor.N, "executor is not a treasury leader");

        const cfg = this.getConfig();
        const exp = this.expensesTable.requireGet(expense_id, "expense not found");
        check(exp.status == 1, "expense is not approved");

        const sym    = Symbol.fromU64(cfg.token_symbol_raw);
        const amount = new Asset(exp.amount, sym);

        sendTransfer(cfg.token_contract, this.receiver, exp.recipient, amount, exp.description);

        exp.status      = 3; // EXECUTED
        exp.executed_at = <u32>currentTimeSec();
        this.expensesTable.update(exp, this.receiver);

        cfg.total_spent += exp.amount;
        this.configTable.set(cfg, this.receiver);

        // Update budget spend tracker
        let b = this.budgetsTable.first();
        while (b) {
            if (b.category == exp.category) {
                b.spent += exp.amount;
                this.budgetsTable.update(b, this.receiver);
                break;
            }
            b = this.budgetsTable.next(b);
        }
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
        public token_contract: _chain.Name | null = null,
        public token_symbol: _chain.Symbol | null = null,
        public approval_needed: u32 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin!);
        enc.pack(this.token_contract!);
        enc.pack(this.token_symbol!);
        enc.packNumber<u32>(this.approval_needed);
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
        this.approval_needed = dec.unpackNumber<u32>();
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

class addleaderAction implements _chain.Packer {
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

class setbudgetAction implements _chain.Packer {
    constructor (
        public category: string = "",
        public allocated: _chain.Asset | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packString(this.category);
        enc.pack(this.allocated!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.category = dec.unpackString();
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.allocated! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += _chain.Utils.calcPackedStringLength(this.category);
        size += this.allocated!.getSize();
        return size;
    }
}

class depositAction implements _chain.Packer {
    constructor (
        public from: _chain.Name | null = null,
        public amount: _chain.Asset | null = null,
        public memo: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.from!);
        enc.pack(this.amount!);
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
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.amount! = obj;
        }
        this.memo = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.from!.getSize();
        size += this.amount!.getSize();
        size += _chain.Utils.calcPackedStringLength(this.memo);
        return size;
    }
}

class proposeexpAction implements _chain.Packer {
    constructor (
        public proposer: _chain.Name | null = null,
        public recipient: _chain.Name | null = null,
        public amount: _chain.Asset | null = null,
        public category: string = "",
        public description: string = "",
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.proposer!);
        enc.pack(this.recipient!);
        enc.pack(this.amount!);
        enc.packString(this.category);
        enc.packString(this.description);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.proposer! = obj;
        }
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.recipient! = obj;
        }
        
        {
            let obj = new _chain.Asset();
            dec.unpack(obj);
            this.amount! = obj;
        }
        this.category = dec.unpackString();
        this.description = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.proposer!.getSize();
        size += this.recipient!.getSize();
        size += this.amount!.getSize();
        size += _chain.Utils.calcPackedStringLength(this.category);
        size += _chain.Utils.calcPackedStringLength(this.description);
        return size;
    }
}

class approveexpAction implements _chain.Packer {
    constructor (
        public approver: _chain.Name | null = null,
        public expense_id: u64 = 0,
        public approve: bool = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.approver!);
        enc.packNumber<u64>(this.expense_id);
        enc.packNumber<bool>(this.approve);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.approver! = obj;
        }
        this.expense_id = dec.unpackNumber<u64>();
        this.approve = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.approver!.getSize();
        size += sizeof<u64>();
        size += sizeof<bool>();
        return size;
    }
}

class executeexpAction implements _chain.Packer {
    constructor (
        public executor: _chain.Name | null = null,
        public expense_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.executor!);
        enc.packNumber<u64>(this.expense_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.executor! = obj;
        }
        this.expense_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.executor!.getSize();
        size += sizeof<u64>();
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

	const mycontract = new gcsctreasry1(_receiver, _firstReceiver, _action);
	const actionData = _chain.readActionData();

	if (receiver == firstReceiver) {
		if (action == 0xC2B28A4D6E600000) {//setconfig
            const args = new setconfigAction();
            args.unpack(actionData);
            mycontract.setconfig(args.admin!,args.token_contract!,args.token_symbol!,args.approval_needed);
        }
		if (action == 0x325315192AB80000) {//addleader
            const args = new addleaderAction();
            args.unpack(actionData);
            mycontract.addleader(args.account!);
        }
		if (action == 0xBAA54DAA2A325570) {//removeleader
            const args = new removeleaderAction();
            args.unpack(actionData);
            mycontract.removeleader(args.account!);
        }
		if (action == 0xC2B27D258AC80000) {//setbudget
            const args = new setbudgetAction();
            args.unpack(actionData);
            mycontract.setbudget(args.category,args.allocated!);
        }
		if (action == 0x4AAB4C3B20000000) {//deposit
            const args = new depositAction();
            args.unpack(actionData);
            mycontract.deposit(args.from!,args.amount!,args.memo);
        }
		if (action == 0xADE95A614AED4000) {//proposeexp
            const args = new proposeexpAction();
            args.unpack(actionData);
            mycontract.proposeexp(args.proposer!,args.recipient!,args.amount!,args.category,args.description);
        }
		if (action == 0x356B7A6D4AED4000) {//approveexp
            const args = new approveexpAction();
            args.unpack(actionData);
            mycontract.approveexp(args.approver!,args.expense_id,args.approve);
        }
		if (action == 0x57548D654AED4000) {//executeexp
            const args = new executeexpAction();
            args.unpack(actionData);
            mycontract.executeexp(args.executor!,args.expense_id);
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
