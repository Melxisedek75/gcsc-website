const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { expect } = require("chai");
const { Asset, Name } = require("@greymass/eosio");
const {
    Blockchain,
    nameToBigInt,
    protonAssert,
    symbolCodeToBigInt,
} = require("@proton/vert");

const TEST_DIR = __dirname;
const CORE_DIR = path.resolve(TEST_DIR, "..");
const GENERATED_DIR = path.join(TEST_DIR, ".vert");
const TOKEN_DIR = path.join(GENERATED_DIR, "token");
const ESCROW_DIR = path.join(GENERATED_DIR, "escrow");

const TOKEN_ACCOUNT = "gcsctoken111";
const ESCROW_ACCOUNT = "gcscrow1111";
const HOMEOWNER = "homeowner";
const CONTRACTOR = "contractor";
const SYMBOL = "GCSC";
const TOTAL_AMOUNT = "100.0000 GCSC";

const ESCROW_DRAFT = 0;
const ESCROW_ACTIVE = 2;
const ESCROW_DISPUTED = 3;
const ESCROW_COMPLETED = 4;

const MS_PENDING = 0;
const MS_SUBMITTED = 1;
const MS_APPROVED = 2;
const MS_RELEASED = 3;
const MS_DISPUTED = 4;

interface Harness {
    blockchain: any;
    token: any;
    escrow: any;
}

let tokenAbi: any;
let tokenWasm: Uint8Array;
let escrowAbi: any;
let escrowWasm: Uint8Array;

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
    fs.mkdirSync(TOKEN_DIR, { recursive: true });
    fs.mkdirSync(ESCROW_DIR, { recursive: true });

    const tokenSourcePath = path.join(CORE_DIR, "gcsctoken111.contract.ts");
    const tokenSource = fs
        .readFileSync(tokenSourcePath, "utf8")
        .replace('@action("transfer", notify)', '@action("transfer")');
    fs.writeFileSync(path.join(TOKEN_DIR, "gcsctoken111.contract.ts"), tokenSource);

    const escrowSourcePath = path.join(CORE_DIR, "gcscrow1111.contract.ts");
    fs.copyFileSync(escrowSourcePath, path.join(ESCROW_DIR, "gcscrow1111.contract.ts"));

    runProtonAsc(path.join(TOKEN_DIR, "gcsctoken111.contract.ts"));
    runProtonAsc(path.join(ESCROW_DIR, "gcscrow1111.contract.ts"));

    tokenAbi = JSON.parse(
        fs.readFileSync(requireArtifact(path.join(TOKEN_DIR, "target"), "gcsctoken111.contract.abi"), "utf8")
    );
    tokenWasm = fs.readFileSync(
        requireArtifact(path.join(TOKEN_DIR, "target"), "gcsctoken111.contract.wasm")
    );
    escrowAbi = JSON.parse(
        fs.readFileSync(requireArtifact(path.join(ESCROW_DIR, "target"), "gcscrow1111.contract.abi"), "utf8")
    );
    escrowWasm = fs.readFileSync(
        requireArtifact(path.join(ESCROW_DIR, "target"), "gcscrow1111.contract.wasm")
    );
}

function createHarness(): Harness {
    const blockchain = new Blockchain();
    const token = blockchain.createAccount({
        name: TOKEN_ACCOUNT,
        abi: tokenAbi,
        wasm: tokenWasm,
    });
    const escrow = blockchain.createAccount({
        name: ESCROW_ACCOUNT,
        abi: escrowAbi,
        wasm: escrowWasm,
        enableInline: true,
    });
    blockchain.createAccounts(HOMEOWNER, CONTRACTOR);
    return { blockchain, token, escrow };
}

async function seedToken(harness: Harness): Promise<void> {
    await harness.token.actions.create([HOMEOWNER, "1000000.0000 GCSC"]).send(`${TOKEN_ACCOUNT}@active`);
    await harness.token.actions.issue([HOMEOWNER, "1000.0000 GCSC", "seed"]).send(`${HOMEOWNER}@active`);
}

async function createEscrow(harness: Harness, projectId = "project-1"): Promise<void> {
    await harness.escrow.actions
        .createescrow([projectId, HOMEOWNER, CONTRACTOR, TOTAL_AMOUNT])
        .send(`${HOMEOWNER}@active`);
}

async function addMilestone(harness: Harness): Promise<void> {
    await harness.escrow.actions
        .addmilestone([0, 1, TOTAL_AMOUNT])
        .send(`${HOMEOWNER}@active`);
}

async function fundEscrow(harness: Harness, projectId = "project-1"): Promise<void> {
    await harness.token.actions
        .transfer([HOMEOWNER, ESCROW_ACCOUNT, TOTAL_AMOUNT, projectId])
        .send(`${HOMEOWNER}@active`);
}

async function createFundedEscrowWithMilestone(harness: Harness): Promise<void> {
    await createEscrow(harness);
    await addMilestone(harness);
    await fundEscrow(harness);
}

function escrowRow(harness: Harness, id = 0): any {
    return harness.escrow.tables.escrows().getTableRow(BigInt(id));
}

function milestoneRow(harness: Harness, id = 0): any {
    return harness.escrow.tables.milestones().getTableRow(BigInt(id));
}

function tokenBalance(harness: Harness, accountName: string): string | undefined {
    const accountScope = nameToBigInt(Name.from(accountName));
    const symbolCode = symbolCodeToBigInt(Asset.SymbolCode.from(SYMBOL));
    const row = harness.token.tables.accounts(accountScope).getTableRow(symbolCode);
    return row ? row.balance : undefined;
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

describe("gcscrow1111 milestone escrow", function () {
    this.timeout(120000);

    before(() => {
        buildArtifacts();
    });

    after(() => {
        cleanGenerated();
    });

    it("creates escrow project successfully", async () => {
        const harness = createHarness();
        await seedToken(harness);

        await createEscrow(harness);

        const escrow = escrowRow(harness);
        expect(escrow.project_id).to.equal("project-1");
        expect(escrow.homeowner).to.equal(HOMEOWNER);
        expect(escrow.contractor).to.equal(CONTRACTOR);
        expect(escrow.total_amount).to.equal(TOTAL_AMOUNT);
        expect(escrow.funded_amount).to.equal("0.0000 GCSC");
        expect(escrow.released_amount).to.equal("0.0000 GCSC");
        expect(escrow.status).to.equal(ESCROW_DRAFT);
    });

    it("funds escrow via token transfer with project_id as memo", async () => {
        const harness = createHarness();
        await seedToken(harness);
        await createEscrow(harness);

        await fundEscrow(harness);

        const escrow = escrowRow(harness);
        expect(escrow.funded_amount).to.equal(TOTAL_AMOUNT);
        expect(escrow.status).to.equal(ESCROW_ACTIVE);
        expect(tokenBalance(harness, HOMEOWNER)).to.equal("900.0000 GCSC");
        expect(tokenBalance(harness, ESCROW_ACCOUNT)).to.equal(TOTAL_AMOUNT);
    });

    it("adds milestone before funding and keeps it on the funded escrow", async () => {
        const harness = createHarness();
        await seedToken(harness);
        await createEscrow(harness);

        await addMilestone(harness);

        let milestone = milestoneRow(harness);
        expect(milestone.escrow_id).to.equal(0);
        expect(milestone.sequence_num).to.equal(1);
        expect(milestone.amount).to.equal(TOTAL_AMOUNT);
        expect(milestone.work_status).to.equal(MS_PENDING);

        await fundEscrow(harness);

        milestone = milestoneRow(harness);
        expect(escrowRow(harness).status).to.equal(ESCROW_ACTIVE);
        expect(milestone.amount).to.equal(TOTAL_AMOUNT);
    });

    it("contractor submits milestone as complete", async () => {
        const harness = createHarness();
        await seedToken(harness);
        await createFundedEscrowWithMilestone(harness);

        await harness.escrow.actions
            .submitms([0, 0, "ipfs://evidence-hash"])
            .send(`${CONTRACTOR}@active`);

        const milestone = milestoneRow(harness);
        expect(milestone.work_status).to.equal(MS_SUBMITTED);
        expect(milestone.payment_status).to.equal(MS_PENDING);
        expect(milestone.evidence_hash).to.equal("ipfs://evidence-hash");
    });

    it("owner approves milestone and contractor receives payment", async () => {
        const harness = createHarness();
        await seedToken(harness);
        await createFundedEscrowWithMilestone(harness);
        await harness.escrow.actions
            .submitms([0, 0, "ipfs://evidence-hash"])
            .send(`${CONTRACTOR}@active`);

        await harness.escrow.actions.approvems([0, 0]).send(`${HOMEOWNER}@active`);

        let milestone = milestoneRow(harness);
        expect(milestone.work_status).to.equal(MS_APPROVED);
        expect(milestone.payment_status).to.equal(MS_APPROVED);

        await harness.escrow.actions.releasems([0, 0]).send(`${HOMEOWNER}@active`);

        milestone = milestoneRow(harness);
        const escrow = escrowRow(harness);
        expect(milestone.work_status).to.equal(MS_RELEASED);
        expect(milestone.payment_status).to.equal(MS_RELEASED);
        expect(escrow.released_amount).to.equal(TOTAL_AMOUNT);
        expect(escrow.status).to.equal(ESCROW_COMPLETED);
        expect(tokenBalance(harness, CONTRACTOR)).to.equal(TOTAL_AMOUNT);
        expect(tokenBalance(harness, ESCROW_ACCOUNT)).to.equal("0.0000 GCSC");
    });

    it("owner disputes milestone and escrow status becomes DISPUTED", async () => {
        const harness = createHarness();
        await seedToken(harness);
        await createFundedEscrowWithMilestone(harness);
        await harness.escrow.actions
            .submitms([0, 0, "ipfs://evidence-hash"])
            .send(`${CONTRACTOR}@active`);

        await harness.escrow.actions
            .disputems([HOMEOWNER, 0, 0])
            .send(`${HOMEOWNER}@active`);

        const escrow = escrowRow(harness);
        const milestone = milestoneRow(harness);
        expect(escrow.status).to.equal(ESCROW_DISPUTED);
        expect(milestone.work_status).to.equal(MS_DISPUTED);
        expect(milestone.payment_status).to.equal(MS_DISPUTED);
    });

    it("funding same escrow twice throws an error", async () => {
        const harness = createHarness();
        await seedToken(harness);
        await createEscrow(harness);
        await fundEscrow(harness);

        await expectProtonAssert(
            harness.token.actions
                .transfer([HOMEOWNER, ESCROW_ACCOUNT, TOTAL_AMOUNT, "project-1"])
                .send(`${HOMEOWNER}@active`),
            "matching draft escrow not found; memo must equal project_id"
        );

        expect(escrowRow(harness).funded_amount).to.equal(TOTAL_AMOUNT);
        expect(tokenBalance(harness, HOMEOWNER)).to.equal("900.0000 GCSC");
    });

    it("releasing milestone without owner approval throws an error", async () => {
        const harness = createHarness();
        await seedToken(harness);
        await createFundedEscrowWithMilestone(harness);
        await harness.escrow.actions
            .submitms([0, 0, "ipfs://evidence-hash"])
            .send(`${CONTRACTOR}@active`);

        await expectProtonAssert(
            harness.escrow.actions.releasems([0, 0]).send(`${HOMEOWNER}@active`),
            "milestone is not approved"
        );

        expect(milestoneRow(harness).work_status).to.equal(MS_SUBMITTED);
        expect(escrowRow(harness).released_amount).to.equal("0.0000 GCSC");
    });
});
