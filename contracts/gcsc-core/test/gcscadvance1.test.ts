const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { expect } = require("chai");
const { Asset, Name } = require("@greymass/eosio");
const { Blockchain, protonAssert } = require("@proton/vert");

const TEST_DIR = __dirname;
const CORE_DIR = path.resolve(TEST_DIR, "..");
const GENERATED_DIR = path.join(TEST_DIR, ".vert-advance");
const ADVANCE_DIR = path.join(GENERATED_DIR, "advance");

const ADVANCE_ACCOUNT = "gcscadvance1";
const ADMIN = "admin";
const HOMEOWNER = "homeowner";
const CONTRACTOR = "contractor";
const BLOCKED = "blocked";

const ESCROW_AMOUNT = "50000.0000 GCSC";
const MILESTONE_AMOUNT = "20000.0000 GCSC";
const RISK_LIMIT = "12000.0000 GCSC";
const VALID_REQUEST = "10000.0000 GCSC";

const STATE_DEMO_ALLOWED = 1;
const STATE_BLOCKED = 2;

const REQUEST_PENDING = 0;
const REQUEST_APPROVED = 1;
const REQUEST_REJECTED = 2;

interface Harness {
    blockchain: any;
    advance: any;
}

let advanceAbi: any;
let advanceWasm: Uint8Array;

function cleanGenerated(): void {
    fs.rmSync(GENERATED_DIR, { recursive: true, force: true });
}

function runProtonAsc(sourcePath: string): void {
    const relativeSourcePath = path.relative(CORE_DIR, sourcePath).replace(/\\/g, "/");
    try {
        if (process.platform === "win32") {
            execFileSync("cmd.exe", ["/d", "/s", "/c", `npx proton-asc ${relativeSourcePath}`], {
                cwd: CORE_DIR,
                stdio: "pipe",
            });
        } else {
            execFileSync("npx", ["proton-asc", relativeSourcePath], {
                cwd: CORE_DIR,
                stdio: "pipe",
            });
        }
    } catch (err: any) {
        const stdout = err.stdout ? err.stdout.toString() : "";
        const stderr = err.stderr ? err.stderr.toString() : "";
        throw new Error(`proton-asc failed for ${relativeSourcePath}\n${stdout}\n${stderr}`);
    }
}

function findArtifact(root: string, fileName: string): string {
    const entries = fs.readdirSync(root, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(root, entry.name);
        if (entry.isFile() && entry.name === fileName) {
            return fullPath;
        }
        if (entry.isDirectory()) {
            const found = findArtifact(fullPath, fileName);
            if (found) {
                return found;
            }
        }
    }
    return "";
}

function requireArtifact(root: string, fileName: string): string {
    const artifact = findArtifact(root, fileName);
    if (!artifact) {
        throw new Error(`Missing generated artifact: ${fileName}`);
    }
    return artifact;
}

function buildArtifacts(): void {
    cleanGenerated();
    fs.mkdirSync(ADVANCE_DIR, { recursive: true });

    const sourcePath = path.join(CORE_DIR, "gcscadvance1.contract.ts");
    fs.copyFileSync(sourcePath, path.join(ADVANCE_DIR, "gcscadvance1.contract.ts"));

    runProtonAsc(path.join(ADVANCE_DIR, "gcscadvance1.contract.ts"));

    advanceAbi = JSON.parse(
        fs.readFileSync(requireArtifact(path.join(ADVANCE_DIR, "target"), "gcscadvance1.contract.abi"), "utf8")
    );
    advanceWasm = fs.readFileSync(
        requireArtifact(path.join(ADVANCE_DIR, "target"), "gcscadvance1.contract.wasm")
    );
}

function createHarness(): Harness {
    const blockchain = new Blockchain();
    const advance = blockchain.createAccount({
        name: ADVANCE_ACCOUNT,
        abi: advanceAbi,
        wasm: advanceWasm,
    });
    blockchain.createAccounts(ADMIN, HOMEOWNER, CONTRACTOR, BLOCKED);
    return { blockchain, advance };
}

async function configure(harness: Harness): Promise<void> {
    await harness.advance.actions
        .setconfig([ADMIN, false])
        .send(`${ADVANCE_ACCOUNT}@active`);
}

async function allowState(harness: Harness, stateCode = "WA"): Promise<void> {
    await harness.advance.actions
        .setstate([stateCode, STATE_DEMO_ALLOWED, "legal-review-hash"])
        .send(`${ADMIN}@active`);
}

async function verifyContractor(harness: Harness, contractor = CONTRACTOR): Promise<void> {
    await harness.advance.actions
        .setverify([contractor, true, "verification-hash"])
        .send(`${ADMIN}@active`);
}

async function requestAdvance(harness: Harness, requestedAmount = VALID_REQUEST): Promise<void> {
    await harness.advance.actions
        .requestadv([
            HOMEOWNER,
            CONTRACTOR,
            "WA",
            42,
            7,
            ESCROW_AMOUNT,
            MILESTONE_AMOUNT,
            RISK_LIMIT,
            requestedAmount,
            "contract-hash",
        ])
        .send(`${CONTRACTOR}@active`);
}

function advanceRow(harness: Harness, id = 0): any {
    return harness.advance.tables.advances().getTableRow(BigInt(id));
}

async function expectProtonAssert(promise: Promise<void>, message: string): Promise<void> {
    try {
        await promise;
    } catch (err: any) {
        expect(err.message).to.equal(protonAssert(message));
        return;
    }
    throw new Error(`Expected proton assert: ${message}`);
}

describe("gcscadvance1 escrow-backed contractor advance gate", function () {
    this.timeout(120000);

    before(() => {
        buildArtifacts();
    });

    after(() => {
        cleanGenerated();
    });

    it("records a pending demo advance when state, contractor, and escrow gates pass", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);

        await requestAdvance(harness);

        const advance = advanceRow(harness);
        expect(advance.id).to.equal(0);
        expect(advance.homeowner).to.equal(HOMEOWNER);
        expect(advance.contractor).to.equal(CONTRACTOR);
        expect(advance.state_code).to.equal("WA");
        expect(advance.escrow_id).to.equal(42);
        expect(advance.milestone_id).to.equal(7);
        expect(advance.escrow_amount).to.equal(ESCROW_AMOUNT);
        expect(advance.milestone_amount).to.equal(MILESTONE_AMOUNT);
        expect(advance.requested_amount).to.equal(VALID_REQUEST);
        expect(advance.approved_amount).to.equal("0.0000 GCSC");
        expect(advance.status).to.equal(REQUEST_PENDING);
        expect(advance.contract_hash).to.equal("contract-hash");
    });

    it("blocks requests in states that are not allowed for demo planning", async () => {
        const harness = createHarness();
        await configure(harness);
        await verifyContractor(harness);

        await expectProtonAssert(
            requestAdvance(harness),
            "state is not enabled for demo advance requests"
        );
    });

    it("requires contractor verification before requesting an advance", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);

        await expectProtonAssert(
            requestAdvance(harness),
            "contractor is not verified"
        );
    });

    it("caps requested amount to the smallest of 20% escrow, 50% milestone, and risk limit", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);

        await expectProtonAssert(
            requestAdvance(harness, "10000.0001 GCSC"),
            "requested amount exceeds demo advance limit"
        );
    });

    it("lets admin approve a pending request and stores the approved amount", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);
        await requestAdvance(harness);

        await harness.advance.actions
            .approveadv([0, "9000.0000 GCSC", "admin-note-hash"])
            .send(`${ADMIN}@active`);

        const advance = advanceRow(harness);
        expect(advance.status).to.equal(REQUEST_APPROVED);
        expect(advance.approved_amount).to.equal("9000.0000 GCSC");
        expect(advance.admin_note_hash).to.equal("admin-note-hash");
    });

    it("lets admin reject a pending request with a review note hash", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);
        await requestAdvance(harness);

        await harness.advance.actions
            .rejectadv([0, "missing-legal-review"])
            .send(`${ADMIN}@active`);

        const advance = advanceRow(harness);
        expect(advance.status).to.equal(REQUEST_REJECTED);
        expect(advance.admin_note_hash).to.equal("missing-legal-review");
    });
});
