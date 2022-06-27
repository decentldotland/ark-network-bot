import { arweave, smartweave } from "../arweave.js";
import { REQUESTS_CACHE_CONTRACT_ADDRESS } from "../constants.js";
import "../setEnv.js";

export async function arweaveCacheRequest(enc_username, enc_group_id) {
  try {
    const pk = JSON.parse(process.env.VALIDATOR_JWK);
    const interaction = `{"function": "set", "username": "${enc_username}", "group_id": "${enc_group_id}"}`;

    const tx = await arweave.createTransaction(
      {
        data: String(Date.now()),
      },
      pk
    );

    tx.addTag("App-Name", "SmartWeaveAction");
    tx.addTag("App-Version", "0.3.0");
    tx.addTag("Contract", REQUESTS_CACHE_CONTRACT_ADDRESS);
    tx.addTag("Input", interaction);
    tx.addTag("Protocol-Name", "Ark-TG-Cache");

    tx.reward = (+tx.reward * 10).toString();
    await arweave.transactions.sign(tx, pk);
    await arweave.transactions.post(tx);

    return tx.id;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function evaluateCacheContractState() {
  try {
    const contract = smartweave.contract(REQUESTS_CACHE_CONTRACT_ADDRESS);
    const contractState = (await contract.readState())?.state;

    return contractState.users;
  } catch (error) {
    console.log(error);
    return false;
  }
}
