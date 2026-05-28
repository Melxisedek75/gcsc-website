const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { expect } = require("chai");
const { Blockchain, protonAssert } = require("@proton/vert");

const TEST_DIR = __dirname;
const CORE_DIR = path.resolve(TEST_DIR, "..");
const GENERATED_DIR = path.join(TEST_DIR, ".vert-workcap");
const WORKCAP_DIR = path.join(GENERATED_DIR, "workcap");

const WORKCAP_ACCOUNT = "gcscworkcap1";
const ADMIN = "admin";
const CONTRACTOR = "contractor";

const CONTRACT_AMOUNT = "80000.0000 GCSC";
const RISK_LIMIT = "15000.0000 GCSC";
const VALID_ADVANCE = "12000.0000 GCSC";

const STATE_DEMO_ALLOWED = 1;
const REQUEST_PENDING = 0;
const REQUEST_APPROVED = 1;
const REQUEST_REJECTED = 2;

interface Harness {
    blockchain: any;
    workcap: any;
}

let workcapAbi: any;
let workcapWasm: Uint8Array;

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
    fs.mkdirSync(WORKCAP_DIR, { recursive: true });

    const sourcePath = path.join(CORE_DIR, "gcscworkcap1.contract.ts");
    fs.copyFileSync(sourcePath, path.join(WORKCAP_DIR, "gcscworkcap1.contract.ts"));

    runProtonAsc(path.join(WORKCAP_DIR, "gcscworkcap1.contract.ts"));

    workcapAbi = JSON.parse(
        fs.readFileSync(requireArtifact(path.join(WORKCAP_DIR, "target"), "gcscworkcap1.contract.abi"), "utf8")
    );
    workcapWasm = fs.readFileSync(
        requireArtifact(path.join(WORKCAP_DIR, "target"), "gcscworkcap1.contract.wasm")
    );
}

function createHarness(): Harness {
    const blockchain = new Blockchain();
    const workcap = blockchain.createAccount({
        name: WORKCAP_ACCOUNT,
        abi: workcapAbi,
        wasm: workcapWasm,
    });
    blockchain.createAccounts(ADMIN, CONTRACTOR);
    return { blockchain, workcap };
}

async function configure(harness: Harness): Promise<void> {
    await harness.workcap.actions
        .setconfig([ADMIN, false, 2000])
        .send(`${WORKCAP_ACCOUNT}@active`);
}

async function allowState(harness: Harness): Promise<void> {
    await harness.workcap.actions
        .setstate(["WA", STATE_DEMO_ALLOWED, "legal-review-hash"])
        .send(`${ADMIN}@active`);
}

async function verifyContractor(harness: Harness): Promise<void> {
    await harness.workcap.actions
        .setverify([CONTRACTOR, true, "verification-hash"])
        .send(`${ADMIN}@active`);
}

async function requestWorkcap(harness: Harness, requestedAmount = VALID_ADVANCE): Promise<void> {
    await harness.workcap.actions
        .requestcap([
            CONTRACTOR,
            "WA",
            CONTRACT_AMOUNT,
            RISK_LIMIT,
            requestedAmount,
            "contract-hash",
            "scope-hash",
        ])
        .send(`${CONTRACTOR}@active`);
}

function workcapRow(harness: Harness, id = 0): any {
    return harness.workcap.tables.workcaps().getTableRow(BigInt(id));
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

describe("gcscworkcap1 contract-backed working capital gate", function () {
    this.timeout(120000);

    before(() => {
        buildArtifacts();
    });

    after(() => {
        cleanGenerated();
    });

    it("records a pending working capital request when contractor and state gates pass", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);

        await requestWorkcap(harness);

        const workcap = workcapRow(harness);
        expect(workcap.id).to.equal(0);
        expect(workcap.contractor).to.equal(CONTRACTOR);
        expect(workcap.state_code).to.equal("WA");
        expect(workcap.contract_amount).to.equal(CONTRACT_AMOUNT);
        expect(workcap.requested_amount).to.equal(VALID_ADVANCE);
        expect(workcap.approved_amount).to.equal("0.0000 GCSC");
        expect(workcap.status).to.equal(REQUEST_PENDING);
        expect(workcap.contract_hash).to.equal("contract-hash");
        expect(workcap.scope_hash).to.equal("scope-hash");
    });

    it("blocks requests before state legal review enables working capital demo", async () => {
        const harness = createHarness();
        await configure(harness);
        await verifyContractor(harness);

        await expectProtonAssert(
            requestWorkcap(harness),
            "state is not enabled for demo working capital requests"
        );
    });

    it("requires contractor verification before requesting working capital", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);

        await expectProtonAssert(
            requestWorkcap(harness),
            "contractor is not verified"
        );
    });

    it("caps requested amount by contract percentage and risk limit", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);

        await expectProtonAssert(
            requestWorkcap(harness, "15000.0001 GCSC"),
            "requested amount exceeds demo working capital limit"
        );
    });

    it("lets admin approve a pending request", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);
        await requestWorkcap(harness);

        await harness.workcap.actions
            .approvecap([0, "10000.0000 GCSC", "admin-note-hash"])
            .send(`${ADMIN}@active`);

        const workcap = workcapRow(harness);
        expect(workcap.status).to.equal(REQUEST_APPROVED);
        expect(workcap.approved_amount).to.equal("10000.0000 GCSC");
        expect(workcap.admin_note_hash).to.equal("admin-note-hash");
    });

    it("lets admin reject with a review note hash", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);
        await requestWorkcap(harness);

        await harness.workcap.actions
            .rejectcap([0, "contract-review-required"])
            .send(`${ADMIN}@active`);

        const workcap = workcapRow(harness);
        expect(workcap.status).to.equal(REQUEST_REJECTED);
        expect(workcap.admin_note_hash).to.equal("contract-review-required");
    });
});
