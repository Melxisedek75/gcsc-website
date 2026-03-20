/**
 * gcscticket1 – GCSC Lottery Ticket Contract
 *
 * 1,000,000.0000 GCSCBUILD = 1 lottery ticket NFT.
 * Tickets are drawn weekly. Prizes: GCSC tokens + USDT.
 *
 * Flow:
 *   1. User transfers N * ticket_price GCSCBUILD to gcscticket1 (memo: "buy:N" or empty for 1).
 *   2. Contract mints N tickets to the sender.
 *   3. Admin adds GCSC/USDT prizes via addprize().
 *   4. Admin calls draw() weekly to pick winners (3 winners: 50/30/20% split).
 *   5. Winners call claimprize(ticket_id) to collect.
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
class LotteryConfig extends Table {
    constructor(
        public admin:           Name  = EMPTY_NAME,
        public build_contract:  Name  = EMPTY_NAME,
        public gcsc_contract:   Name  = EMPTY_NAME,
        public usdt_contract:   Name  = EMPTY_NAME,
        public ticket_price:    i64   = 10_000_000_0000,
        public draw_interval:   u32   = 604800,
        public next_draw:       u32   = 0,
        public current_draw_id: u64   = 1,
        public next_ticket_id:  u64   = 1,
        public draw_start_tick: u64   = 1,
        public paused:          bool  = false
    ) { super(); }

    @primary
    get primary(): u64 { return 0; }
}

@table("tickets")
class Ticket extends Table {
    constructor(
        public ticket_id:     u64  = 0,
        public owner:         Name = EMPTY_NAME,
        public draw_id:       u64  = 0,
        public purchased_at:  u32  = 0,
        public prize_claimed: bool = false
    ) { super(); }

    @primary
    get primary(): u64 { return this.ticket_id; }
}

@table("draws")
class Draw extends Table {
    constructor(
        public draw_id:      u64  = 0,
        public draw_time:    u32  = 0,
        public start_ticket: u64  = 0,
        public end_ticket:   u64  = 0,
        public gcsc_prize:   i64  = 0,
        public usdt_prize:   i64  = 0,
        public winner1:      u64  = 0,
        public winner2:      u64  = 0,
        public winner3:      u64  = 0,
        public completed:    bool = false
    ) { super(); }

    @primary
    get primary(): u64 { return this.draw_id; }
}

// ─── Contract ─────────────────────────────────────────────────────────────────

@contract
class gcscticket1 extends Contract {

    // ── Admin: configure ──────────────────────────────────────────────────────

    @action("setconfig")
    setconfig(
        admin:          Name,
        build_contract: Name,
        gcsc_contract:  Name,
        usdt_contract:  Name,
        ticket_price:   i64,
        draw_interval:  u32
    ): void {
        const cfgTable = new TableStore<LotteryConfig>(this.receiver, this.receiver);
        const existing = cfgTable.get(0);
        if (existing) requireAuth(existing.admin);
        else           requireAuth(this.receiver);

        check(ticket_price > 0,  "ticket price must be positive");
        check(draw_interval > 0, "draw interval must be positive");

        const now = currentTimeSec();
        if (existing) {
            existing.admin          = admin;
            existing.build_contract = build_contract;
            existing.gcsc_contract  = gcsc_contract;
            existing.usdt_contract  = usdt_contract;
            existing.ticket_price   = ticket_price;
            existing.draw_interval  = draw_interval;
            if (existing.next_draw == 0) existing.next_draw = now + draw_interval;
            cfgTable.update(existing, this.receiver);
        } else {
            cfgTable.store(new LotteryConfig(
                admin, build_contract, gcsc_contract, usdt_contract,
                ticket_price, draw_interval,
                now + draw_interval, 1, 1, 1, false
            ), this.receiver);
            // Create draw #1
            const drawTable = new TableStore<Draw>(this.receiver, this.receiver);
            drawTable.store(new Draw(1, 0, 1, 0, 0, 0, 0, 0, 0, false), this.receiver);
        }
    }

    // ── Admin: add prizes to current draw ────────────────────────────────────

    @action("addprize")
    addprize(from: Name, draw_id: u64, gcsc_amount: i64, usdt_amount: i64): void {
        requireAuth(from);
        const cfgTable  = new TableStore<LotteryConfig>(this.receiver, this.receiver);
        const cfg       = cfgTable.requireGet(0, "contract not configured");
        const drawTable = new TableStore<Draw>(this.receiver, this.receiver);
        const draw      = drawTable.requireGet(draw_id, "draw not found");
        check(!draw.completed, "draw already completed");
        check(gcsc_amount >= 0 && usdt_amount >= 0, "amounts must be non-negative");
        check(gcsc_amount > 0 || usdt_amount > 0,   "must add at least one prize");

        if (gcsc_amount > 0) {
            const gcscSym = new Symbol("GCSC", 4);
            sendTransfer(cfg.gcsc_contract, from, this.receiver, new Asset(gcsc_amount, gcscSym), "prize pool");
            draw.gcsc_prize += gcsc_amount;
        }
        if (usdt_amount > 0) {
            const usdtSym = new Symbol("USDT", 4);
            sendTransfer(cfg.usdt_contract, from, this.receiver, new Asset(usdt_amount, usdtSym), "prize pool");
            draw.usdt_prize += usdt_amount;
        }
        drawTable.update(draw, this.receiver);
    }

    // ── Weekly draw ───────────────────────────────────────────────────────────

    @action("draw")
    draw(caller: Name): void {
        requireAuth(caller);
        const cfgTable  = new TableStore<LotteryConfig>(this.receiver, this.receiver);
        const cfg       = cfgTable.requireGet(0, "contract not configured");
        check(!cfg.paused, "lottery is paused");

        const now = currentTimeSec();
        check(now >= cfg.next_draw, "too early for next draw");

        const drawTable   = new TableStore<Draw>(this.receiver, this.receiver);
        const currentDraw = drawTable.requireGet(cfg.current_draw_id, "current draw not found");
        check(!currentDraw.completed, "current draw already completed");

        const endTicket   = cfg.next_ticket_id - 1;
        const totalInDraw = endTicket - cfg.draw_start_tick + 1;

        if (totalInDraw == 0) {
            currentDraw.draw_time    = now;
            currentDraw.start_ticket = cfg.draw_start_tick;
            currentDraw.end_ticket   = endTicket;
            currentDraw.completed    = true;
            drawTable.update(currentDraw, this.receiver);
        } else {
            const seed:  u64 = <u64>now * 1_000_003 ^ cfg.current_draw_id * 998_244_353;
            const range: u64 = totalInDraw;
            const base:  u64 = cfg.draw_start_tick;

            const w1: u64 = base + (seed                              % range);
            const w2: u64 = base + ((seed * 6_364_136_223_846_793_005) % range);
            const w3: u64 = base + ((seed * 2_862_933_555_777_941_757) % range);

            currentDraw.draw_time    = now;
            currentDraw.start_ticket = cfg.draw_start_tick;
            currentDraw.end_ticket   = endTicket;
            currentDraw.winner1      = w1;
            currentDraw.winner2      = w2 != w1 ? w2 : (w2 % range == range - 1 ? base : w2 + 1);
            currentDraw.winner3      = w3 != currentDraw.winner1 && w3 != currentDraw.winner2
                                       ? w3
                                       : (currentDraw.winner2 % range == range - 1 ? base : currentDraw.winner2 + 1);
            currentDraw.completed    = true;
            drawTable.update(currentDraw, this.receiver);
        }

        // Advance to next draw
        const nextId = cfg.current_draw_id + 1;
        cfg.current_draw_id  = nextId;
        cfg.draw_start_tick  = cfg.next_ticket_id;
        cfg.next_draw        = now + cfg.draw_interval;
        cfgTable.update(cfg, this.receiver);

        // Create next draw record
        drawTable.store(new Draw(nextId, 0, cfg.next_ticket_id, 0, 0, 0, 0, 0, 0, false), this.receiver);
    }

    // ── Winner claims prize ───────────────────────────────────────────────────

    @action("claimprize")
    claimprize(winner: Name, ticket_id: u64): void {
        requireAuth(winner);
        const ticketTable = new TableStore<Ticket>(this.receiver, this.receiver);
        const ticket      = ticketTable.requireGet(ticket_id, "ticket not found");
        check(ticket.owner == winner, "you do not own this ticket");
        check(!ticket.prize_claimed,  "prize already claimed");

        const drawTable = new TableStore<Draw>(this.receiver, this.receiver);
        const draw      = drawTable.requireGet(ticket.draw_id, "draw not found");
        check(draw.completed, "draw not yet completed");

        const isWinner1 = draw.winner1 == ticket_id;
        const isWinner2 = draw.winner2 == ticket_id;
        const isWinner3 = draw.winner3 == ticket_id;
        check(isWinner1 || isWinner2 || isWinner3, "ticket is not a winning ticket");

        const cfgTable = new TableStore<LotteryConfig>(this.receiver, this.receiver);
        const cfg      = cfgTable.requireGet(0, "contract not configured");

        let gcscShare: i64 = 0;
        let usdtShare: i64 = 0;
        if (isWinner1) {
            gcscShare = draw.gcsc_prize / 2;
            usdtShare = draw.usdt_prize / 2;
        } else if (isWinner2) {
            gcscShare = (draw.gcsc_prize * 3) / 10;
            usdtShare = (draw.usdt_prize * 3) / 10;
        } else {
            gcscShare = draw.gcsc_prize / 5;
            usdtShare = draw.usdt_prize / 5;
        }

        if (gcscShare > 0) {
            sendTransfer(cfg.gcsc_contract, this.receiver, winner,
                new Asset(gcscShare, new Symbol("GCSC", 4)), "lottery prize");
        }
        if (usdtShare > 0) {
            sendTransfer(cfg.usdt_contract, this.receiver, winner,
                new Asset(usdtShare, new Symbol("USDT", 4)), "lottery prize");
        }

        ticket.prize_claimed = true;
        ticketTable.update(ticket, this.receiver);
    }

    // ── Admin: pause/unpause ──────────────────────────────────────────────────

    @action("pause")
    pause(paused: bool): void {
        const cfgTable = new TableStore<LotteryConfig>(this.receiver, this.receiver);
        const cfg      = cfgTable.requireGet(0, "contract not configured");
        requireAuth(cfg.admin);
        cfg.paused = paused;
        cfgTable.update(cfg, this.receiver);
    }

    // ── Notify: incoming GCSCBUILD transfer → mint tickets ───────────────────

    @action("transfer", notify)
    transfer(from: Name, to: Name, quantity: Asset, memo: string): void {
        if (to != this.receiver) return;

        const cfgTable = new TableStore<LotteryConfig>(this.receiver, this.receiver);
        const cfg      = cfgTable.get(0);
        if (!cfg) return;
        if (cfg.paused) return;

        if (this.firstReceiver != cfg.build_contract) return;

        check(quantity.amount >= cfg.ticket_price,      "insufficient GCSCBUILD for one ticket");
        check(quantity.amount % cfg.ticket_price == 0,  "amount must be exact multiple of ticket price");

        const numTickets = quantity.amount / cfg.ticket_price;
        check(numTickets >= 1 && numTickets <= 100, "can buy 1-100 tickets per transaction");

        const now       = currentTimeSec();
        const drawId    = cfg.current_draw_id;
        const ticketTbl = new TableStore<Ticket>(this.receiver, this.receiver);

        for (let i: i64 = 0; i < numTickets; i++) {
            const tid = cfg.next_ticket_id + <u64>i;
            ticketTbl.store(new Ticket(tid, from, drawId, now, false), this.receiver);
        }
        cfg.next_ticket_id += <u64>numTickets;
        cfgTable.update(cfg, this.receiver);
    }
}
