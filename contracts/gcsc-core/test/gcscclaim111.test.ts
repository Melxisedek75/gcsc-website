const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { expect } = require("chai");
const { Blockchain, protonAssert } = require("@proton/vert");

const TEST_DIR = __dirname;
const CORE_DIR = path.resolve(TEST_DIR, "..");
const GENERATED_DIR = path.join(TEST_DIR, ".vert-claim");
const CLAIM_DIR = path.join(GENERATED_DIR, "claim");

const CLAIM_ACCOUNT = "gcscclaim111";
const ADMIN = "admin";
const HOMEOWNER = "homeowner";

const ESTIMATED_PAYOUT = "50000.0000 GCSC";
const RISK_LIMIT = "12000.0000 GCSC";
const VALID_ADVANCE = "10000.0000 GCSC";

const STATE_DEMO_ALLOWED = 1;
const CLAIM_PENDING = 0;
const CLAIM_APPROVED = 1;
const CLAIM_REJECTED = 2;

interface Harness {
    blockchain: any;
    claim: any;
}

let claimAbi: any;
let claimWasm: Uint8Array;

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
    fs.mkdirSync(CLAIM_DIR, { recursive: true });

    const sourcePath = path.join(CORE_DIR, "gcscclaim111.contract.ts");
    fs.copyFileSync(sourcePath, path.join(CLAIM_DIR, "gcscclaim111.contract.ts"));

    runProtonAsc(path.join(CLAIM_DIR, "gcscclaim111.contract.ts"));

    claimAbi = JSON.parse(
        fs.readFileSync(requireArtifact(path.join(CLAIM_DIR, "target"), "gcscclaim111.contract.abi"), "utf8")
    );
    claimWasm = fs.readFileSync(
        requireArtifact(path.join(CLAIM_DIR, "target"), "gcscclaim111.contract.wasm")
    );
}

function createHarness(): Harness {
    const blockchain = new Blockchain();
    const claim = blockchain.createAccount({
        name: CLAIM_ACCOUNT,
        abi: claimAbi,
        wasm: claimWasm,
    });
    blockchain.createAccounts(ADMIN, HOMEOWNER);
    return { blockchain, claim };
}

async function configure(harness: Harness): Promise<void> {
    await harness.claim.actions
        .setconfig([ADMIN, false, 2000])
        .send(`${CLAIM_ACCOUNT}@active`);
}

async function allowState(harness: Harness): Promise<void> {
    await harness.claim.actions
        .setstate(["WA", STATE_DEMO_ALLOWED, "legal-review-hash"])
        .send(`${ADMIN}@active`);
}

async function requestClaim(harness: Harness, requestedAmount = VALID_ADVANCE): Promise<void> {
    await harness.claim.actions
        .requestclaim([
            HOMEOWNER,
            "WA",
            "water",
            ESTIMATED_PAYOUT,
            RISK_LIMIT,
            requestedAmount,
            "policy-hash",
            "incident-hash",
        ])
        .send(`${HOMEOWNER}@active`);
}

function claimRow(harness: Harness, id = 0): any {
    return harness.claim.tables.claims().getTableRow(BigInt(id));
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

describe("gcscclaim111 ClaimBridge emergency advance gate", function () {
    this.timeout(120000);

    before(() => {
        buildArtifacts();
    });

    after(() => {
        cleanGenerated();
    });

    it("records a pending emergency claim advance when state gate passes", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);

        await requestClaim(harness);

        const claim = claimRow(harness);
        expect(claim.id).to.equal(0);
        expect(claim.homeowner).to.equal(HOMEOWNER);
        expect(claim.state_code).to.equal("WA");
        expect(claim.incident_type).to.equal("water");
        expect(claim.estimated_payout).to.equal(ESTIMATED_PAYOUT);
        expect(claim.requested_amount).to.equal(VALID_ADVANCE);
        expect(claim.approved_amount).to.equal("0.0000 GCSC");
        expect(claim.status).to.equal(CLAIM_PENDING);
        expect(claim.policy_hash).to.equal("policy-hash");
        expect(claim.incident_hash).to.equal("incident-hash");
    });

    it("blocks requests before state legal review enables ClaimBridge demo", async () => {
        const harness = createHarness();
        await configure(harness);

        await expectProtonAssert(
            requestClaim(harness),
            "state is not enabled for demo claim advance requests"
        );
    });

    it("caps requested amount by payout percentage and risk limit", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);

        await expectProtonAssert(
            requestClaim(harness, "10000.0001 GCSC"),
            "requested amount exceeds demo claim advance limit"
        );
    });

    it("lets admin approve a pending claim request", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await requestClaim(harness);

        await harness.claim.actions
            .approveclaim([0, "8000.0000 GCSC", "admin-note-hash"])
            .send(`${ADMIN}@active`);

        const claim = claimRow(harness);
        expect(claim.status).to.equal(CLAIM_APPROVED);
        expect(claim.approved_amount).to.equal("8000.0000 GCSC");
        expect(claim.admin_note_hash).to.equal("admin-note-hash");
    });

    it("lets admin reject a pending claim request", async () => {
        const harness = createHarness();
        await configure(harness);
        await allowState(harness);
        await requestClaim(harness);

        await harness.claim.actions
            .rejectclaim([0, "requires-insurance-review"])
            .send(`${ADMIN}@active`);

        const claim = claimRow(harness);
        expect(claim.status).to.equal(CLAIM_REJECTED);
        expect(claim.admin_note_hash).to.equal("requires-insurance-review");
    });
});
