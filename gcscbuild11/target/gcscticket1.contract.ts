import * as _chain from "as-chain";
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


@packer(nocodegen)
class Transfer implements _chain.Packer {
    
    constructor(
        public from:     Name   = EMPTY_NAME,
        public to:       Name   = EMPTY_NAME,
        public quantity: Asset  = new Asset(),
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



class LotteryConfigDB extends _chain.MultiIndex<LotteryConfig> {

}

@table("config", nocodegen)

class LotteryConfig implements _chain.MultiIndexValue {
    
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
    ) {  }

    @primary
    get primary(): u64 { return 0; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin);
        enc.pack(this.build_contract);
        enc.pack(this.gcsc_contract);
        enc.pack(this.usdt_contract);
        enc.packNumber<i64>(this.ticket_price);
        enc.packNumber<u32>(this.draw_interval);
        enc.packNumber<u32>(this.next_draw);
        enc.packNumber<u64>(this.current_draw_id);
        enc.packNumber<u64>(this.next_ticket_id);
        enc.packNumber<u64>(this.draw_start_tick);
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
            this.build_contract = obj;
        }
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.gcsc_contract = obj;
        }
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.usdt_contract = obj;
        }
        this.ticket_price = dec.unpackNumber<i64>();
        this.draw_interval = dec.unpackNumber<u32>();
        this.next_draw = dec.unpackNumber<u32>();
        this.current_draw_id = dec.unpackNumber<u64>();
        this.next_ticket_id = dec.unpackNumber<u64>();
        this.draw_start_tick = dec.unpackNumber<u64>();
        this.paused = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin.getSize();
        size += this.build_contract.getSize();
        size += this.gcsc_contract.getSize();
        size += this.usdt_contract.getSize();
        size += sizeof<i64>();
        size += sizeof<u32>();
        size += sizeof<u32>();
        size += sizeof<u64>();
        size += sizeof<u64>();
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
        return LotteryConfig.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return LotteryConfig.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): LotteryConfigDB {
        return new LotteryConfigDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class TicketDB extends _chain.MultiIndex<Ticket> {

}

@table("tickets", nocodegen)

class Ticket implements _chain.MultiIndexValue {
    
    constructor(
        public ticket_id:     u64  = 0,
        public owner:         Name = EMPTY_NAME,
        public draw_id:       u64  = 0,
        public purchased_at:  u32  = 0,
        public prize_claimed: bool = false
    ) {  }

    @primary
    get primary(): u64 { return this.ticket_id; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.ticket_id);
        enc.pack(this.owner);
        enc.packNumber<u64>(this.draw_id);
        enc.packNumber<u32>(this.purchased_at);
        enc.packNumber<bool>(this.prize_claimed);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.ticket_id = dec.unpackNumber<u64>();
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.owner = obj;
        }
        this.draw_id = dec.unpackNumber<u64>();
        this.purchased_at = dec.unpackNumber<u32>();
        this.prize_claimed = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += this.owner.getSize();
        size += sizeof<u64>();
        size += sizeof<u32>();
        size += sizeof<bool>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0xCB91056700000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Ticket.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Ticket.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): TicketDB {
        return new TicketDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}



class DrawDB extends _chain.MultiIndex<Draw> {

}

@table("draws", nocodegen)

class Draw implements _chain.MultiIndexValue {
    
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
    ) {  }

    @primary
    get primary(): u64 { return this.draw_id; }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.packNumber<u64>(this.draw_id);
        enc.packNumber<u32>(this.draw_time);
        enc.packNumber<u64>(this.start_ticket);
        enc.packNumber<u64>(this.end_ticket);
        enc.packNumber<i64>(this.gcsc_prize);
        enc.packNumber<i64>(this.usdt_prize);
        enc.packNumber<u64>(this.winner1);
        enc.packNumber<u64>(this.winner2);
        enc.packNumber<u64>(this.winner3);
        enc.packNumber<bool>(this.completed);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        this.draw_id = dec.unpackNumber<u64>();
        this.draw_time = dec.unpackNumber<u32>();
        this.start_ticket = dec.unpackNumber<u64>();
        this.end_ticket = dec.unpackNumber<u64>();
        this.gcsc_prize = dec.unpackNumber<i64>();
        this.usdt_prize = dec.unpackNumber<i64>();
        this.winner1 = dec.unpackNumber<u64>();
        this.winner2 = dec.unpackNumber<u64>();
        this.winner3 = dec.unpackNumber<u64>();
        this.completed = dec.unpackNumber<bool>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += sizeof<u64>();
        size += sizeof<u32>();
        size += sizeof<u64>();
        size += sizeof<u64>();
        size += sizeof<i64>();
        size += sizeof<i64>();
        size += sizeof<u64>();
        size += sizeof<u64>();
        size += sizeof<u64>();
        size += sizeof<bool>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x4DCDCC0000000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Draw.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Draw.tableIndexes(code, scope);
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


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): DrawDB {
        return new DrawDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
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


class setconfigAction implements _chain.Packer {
    constructor (
        public admin: _chain.Name | null = null,
        public build_contract: _chain.Name | null = null,
        public gcsc_contract: _chain.Name | null = null,
        public usdt_contract: _chain.Name | null = null,
        public ticket_price: i64 = 0,
        public draw_interval: u32 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.admin!);
        enc.pack(this.build_contract!);
        enc.pack(this.gcsc_contract!);
        enc.pack(this.usdt_contract!);
        enc.packNumber<i64>(this.ticket_price);
        enc.packNumber<u32>(this.draw_interval);
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
            this.build_contract! = obj;
        }
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.gcsc_contract! = obj;
        }
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.usdt_contract! = obj;
        }
        this.ticket_price = dec.unpackNumber<i64>();
        this.draw_interval = dec.unpackNumber<u32>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.admin!.getSize();
        size += this.build_contract!.getSize();
        size += this.gcsc_contract!.getSize();
        size += this.usdt_contract!.getSize();
        size += sizeof<i64>();
        size += sizeof<u32>();
        return size;
    }
}

class addprizeAction implements _chain.Packer {
    constructor (
        public from: _chain.Name | null = null,
        public draw_id: u64 = 0,
        public gcsc_amount: i64 = 0,
        public usdt_amount: i64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.from!);
        enc.packNumber<u64>(this.draw_id);
        enc.packNumber<i64>(this.gcsc_amount);
        enc.packNumber<i64>(this.usdt_amount);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.from! = obj;
        }
        this.draw_id = dec.unpackNumber<u64>();
        this.gcsc_amount = dec.unpackNumber<i64>();
        this.usdt_amount = dec.unpackNumber<i64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.from!.getSize();
        size += sizeof<u64>();
        size += sizeof<i64>();
        size += sizeof<i64>();
        return size;
    }
}

class drawAction implements _chain.Packer {
    constructor (
        public caller: _chain.Name | null = null,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.caller!);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.caller! = obj;
        }
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.caller!.getSize();
        return size;
    }
}

class claimprizeAction implements _chain.Packer {
    constructor (
        public winner: _chain.Name | null = null,
        public ticket_id: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.winner!);
        enc.packNumber<u64>(this.ticket_id);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.winner! = obj;
        }
        this.ticket_id = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.winner!.getSize();
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

export function apply(receiver: u64, firstReceiver: u64, action: u64): void {
	const _receiver = new _chain.Name(receiver);
	const _firstReceiver = new _chain.Name(firstReceiver);
	const _action = new _chain.Name(action);

	const mycontract = new gcscticket1(_receiver, _firstReceiver, _action);
	const actionData = _chain.readActionData();

	if (receiver == firstReceiver) {
		if (action == 0xC2B28A4D6E600000) {//setconfig
            const args = new setconfigAction();
            args.unpack(actionData);
            mycontract.setconfig(args.admin!,args.build_contract!,args.gcsc_contract!,args.usdt_contract!,args.ticket_price,args.draw_interval);
        }
		if (action == 0x32535BBBEA000000) {//addprize
            const args = new addprizeAction();
            args.unpack(actionData);
            mycontract.addprize(args.from!,args.draw_id,args.gcsc_amount,args.usdt_amount);
        }
		if (action == 0x4DCDC00000000000) {//draw
            const args = new drawAction();
            args.unpack(actionData);
            mycontract.draw(args.caller!);
        }
		if (action == 0x444CE956EEFA8000) {//claimprize
            const args = new claimprizeAction();
            args.unpack(actionData);
            mycontract.claimprize(args.winner!,args.ticket_id);
        }
		if (action == 0xA9B5850000000000) {//pause
            const args = new pauseAction();
            args.unpack(actionData);
            mycontract.pause(args.paused);
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
