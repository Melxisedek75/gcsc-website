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

@table("budgets")
class Budget extends Table {
    constructor(
        public id:        u64    = 0,
        public category:  string = "",
        public allocated: i64    = 0,   // raw token units
        public spent:     i64    = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }
}

@table("expenses")
class Expense extends Table {
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
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_status(): u64 { return <u64>this.status; }
    set by_status(v: u64) { this.status = <u8>v; }
}

@table("approvals")
class Approval extends Table {
    constructor(
        public id:          u64  = 0,
        public expense_id:  u64  = 0,
        public approver:    Name = EMPTY_NAME,
        public approved:    bool = false,
        public voted_at:    u32  = 0
    ) { super(); }

    @primary
    get primary(): u64 { return this.id; }

    @secondary
    get by_expense(): u64 { return this.expense_id; }
    set by_expense(v: u64) { this.expense_id = v; }
}

@table("leaders")
class Leader extends Table {
    constructor(
        public account: Name = EMPTY_NAME,
        public active:  bool = true
    ) { super(); }

    @primary
    get primary(): u64 { return this.account.N; }
}

@table("config")
class Config extends Table {
    constructor(
        public admin:            Name = EMPTY_NAME,
        public token_contract:   Name = EMPTY_NAME,
        public token_symbol_raw: u64  = 0,
        public approval_needed:  u32  = 2,    // min leader approvals to execute
        public total_received:   i64  = 0,
        public total_spent:      i64  = 0,
        public paused:           bool = false
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
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
