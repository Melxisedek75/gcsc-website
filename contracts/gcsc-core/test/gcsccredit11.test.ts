const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { expect } = require("chai");
const { Blockchain, protonAssert } = require("@proton/vert");

const TEST_DIR = __dirname;
const CORE_DIR = path.resolve(TEST_DIR, "..");
const GENERATED_DIR = path.join(TEST_DIR, ".vert-credit");
const CREDIT_DIR = path.join(GENERATED_DIR, "credit");

const CREDIT_ACCOUNT = "gcsccredit11";
const ADMIN = "admin";
const CONTRACTOR = "contractor";

const COLLATERAL_AMOUNT = "10000.0000 GCSC";
const RISK_LIMIT = "3000.0000 GCSC";
const VALID_CREDIT = "2500.0000 GCSC";

const STATE_DEMO_ALLOWED = 1;
const REQUEST_PENDING = 0;
const REQUEST_APPROVED = 1;
const REQUEST_REJECTED = 2;

interface Harness {
    blockchain: any;
    credit: any;
}

let creditAbi: any;
let creditWasm: Uint8Array;

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
    fs.mkdirSync(CREDIT_DIR, { recursive: true });

    const sourcePath = path.join(CORE_DIR, "gcsccredit11.contract.ts");
    fs.copyFileSync(sourcePath, path.join(CREDIT_DIR, "gcsccredit11.contract.ts"));

    runProtonAsc(path.join(CREDIT_DIR, "gcsccredit11.contract.ts"));

    creditAbi = JSON.parse(
        fs.readFileSync(requireArtifact(path.join(CREDIT_DIR, "target"), "gcsccredit11.contract.abi"), "utf8")
    );
    creditWasm = fs.readFileSync(
        requireArtifact(path.join(CREDIT_DIR, "target"), "gcsccredit11.contract.wasm")
    );
}

function createHarness(): Harness {
    const blockchain = new Blockchain();
    const credit = blockchain.createAccount({
        name: CREDIT_ACCOUNT,
        abi: creditAbi,
        wasm: creditWasm,
    });
    blockchain.createAccounts(ADMIN, CONTRACTOR);
    return { blockchain, credit };
}

async function configure(harness: Harness): Promise<void> {
    await harness.credit.actions
        .setconfig([ADMIN, false, 2500])
        .send(`${CREDIT_ACCOUNT}@active`);
}

async function allowState(harness: Harness): Promise<void> {
    await harness.credit.actions
        .setstate(["WA", STATE_DEMO_ALLOWED, "legal-review-hash"])
        .send(`${ADMIN}@active`);
}

async function verifyContractor(harness: Harness): Promise<void> {
    await harness.credit.actions
        .setverify([CONTRACTOR, true, "verification-hash"])
        .send(`${ADMIN}@active`);
}

async function requestCredit(harness: Harness, requestedAmount = VALID_CREDIT): Promise<void> {
    await harness.credit.actions
        .requestcr([
            CONTRACTOR,
            "WA",
            "equipment",
            COLLATERAL_AMOUNT,
            RISK_LIMIT,
            requestedAmount,
            "equipment-plan-hash",
        ])
        .send(`${CONTRACTOR}@active`);
}

function creditRow(harness: Harness, id = 0): any {
    return harness.credit.tables.credits().getTableRow(BigInt(id));
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

describe("gcsccredit11 token-collateral equipment credit gate", function () {
    this.timeout(120000);

    before(() => {
        buildArtifacts();
    });

    after(() => {
        cleanGenerated();
    });

    it("records a pending equipment credit request when contractor and state gates pass", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);

        await requestCredit(harness);

        const credit = creditRow(harness);
        expect(credit.id).to.equal(0);
        expect(credit.contractor).to.equal(CONTRACTOR);
        expect(credit.state_code).to.equal("WA");
        expect(credit.credit_purpose).to.equal("equipment");
        expect(credit.collateral_amount).to.equal(COLLATERAL_AMOUNT);
        expect(credit.requested_amount).to.equal(VALID_CREDIT);
        expect(credit.approved_amount).to.equal("0.0000 GCSC");
        expect(credit.status).to.equal(REQUEST_PENDING);
        expect(credit.equipment_plan_hash).to.equal("equipment-plan-hash");
    });

    it("blocks requests before state legal review enables demo credit", async () => {
        const harness = createHarness();
        await configure(harness);
        await verifyContractor(harness);

        await expectProtonAssert(
            requestCredit(harness),
            "state is not enabled for demo credit requests"
        );
    });

    it("requires contractor verification before requesting credit", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);

        await expectProtonAssert(
            requestCredit(harness),
            "contractor is not verified"
        );
    });

    it("caps requested credit by collateral LTV and risk limit", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);

        await expectProtonAssert(
            requestCredit(harness, "2500.0001 GCSC"),
            "requested amount exceeds demo credit limit"
        );
    });

    it("lets admin approve less than or equal to the requested amount", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);
        await requestCredit(harness);

        await harness.credit.actions
            .approvecr([0, "2000.0000 GCSC", "admin-note-hash"])
            .send(`${ADMIN}@active`);

        const credit = creditRow(harness);
        expect(credit.status).to.equal(REQUEST_APPROVED);
        expect(credit.approved_amount).to.equal("2000.0000 GCSC");
        expect(credit.admin_note_hash).to.equal("admin-note-hash");
    });

    it("lets admin reject with a review note hash", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await verifyContractor(harness);
        await requestCredit(harness);

        await harness.credit.actions
            .rejectcr([0, "state-review-required"])
            .send(`${ADMIN}@active`);

        const credit = creditRow(harness);
        expect(credit.status).to.equal(REQUEST_REJECTED);
        expect(credit.admin_note_hash).to.equal("state-review-required");
    });
});
