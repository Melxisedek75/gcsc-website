import { Blockchain } from "@proton/vert";

async function wait(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    const blockchain = new Blockchain();
    const contract = blockchain.createContract('gcsctoken111', 'target/gcsctoken111.contract');
    await wait(0);

    // Put you actions calls here
    await contract.actions.init([]).send('gcsctoken111@active');
}

main();
