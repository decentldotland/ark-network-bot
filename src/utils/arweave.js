import Arweave from "arweave";
import { SmartWeaveNodeFactory } from "redstone-smartweave";
import { REGISTRY_ORACLE_ADDRESS } from "./constants.js";
import { encrypt, decrypt } from "./crypto.js";
import "../utils/setEnv.js";

export const arweave = Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443,
  timeout: 60000,
  logging: false,
});

export const smartweave = SmartWeaveNodeFactory.memCached(arweave);

export async function evaluateGuildsRegistryState() {
  try {
    const contract = smartweave.contract(REGISTRY_ORACLE_ADDRESS);
    const contractState = (await contract.readState())?.state;
    const decryptedState = await decodeGroupIds(contractState);

    return decryptedState;
  } catch (error) {
    console.log(error);
  }
}

async function decodeGroupIds(guild_state) {
  try {
    for (const guild of guild_state.guilds) {
      if (guild.group_id && !guild.dec_group_id) {
        guild.dec_group_id = await decrypt(guild.group_id);
      }
    }
    return guild_state;
  } catch (error) {
    console.log(error);
  }
}

export async function evaluateContractState(pst_swc_id) {
  try {
    // PST contract validity is checked during the guild creation (FE);
    const contract = smartweave.contract(pst_swc_id);
    const contractState = (await contract.readState())?.state;

    return contractState;
  } catch (error) {
    console.log(error);
  }
}

export async function decryptTelegramUsernameFromState(ark_state) {
  try {
    for (const user of ark_state.identities) {
      if (user.telegram_username) {
        user.dec_telegram_username = await decrypt(user.telegram_username);
      }
    }
    return ark_state;
  } catch (error) {
    console.log(error);
  }
}

export async function verifyGuild(guild_id, group_id) {
  try {
    const pk = JSON.parse(process.env.VALIDATOR_JWK);
    const encGroupId = await encrypt(String(group_id));
    const interaction = `{"function": "verifyGuild", "guild_id": "${guild_id}", "group_id": "${encGroupId}"}`;

    const tx = await arweave.createTransaction(
      {
        data: String(Date.now()),
      },
      pk
    );

    tx.addTag("App-Name", "SmartWeaveAction");
    tx.addTag("App-Version", "0.3.0");
    tx.addTag("Contract", REGISTRY_ORACLE_ADDRESS);
    tx.addTag("Input", interaction);
    tx.addTag("Protocol-Name", "Ark-Guilds");
    tx.addTag("Guild-Type", "Telegram");

    tx.reward = (+tx.reward * 10).toString();
    await arweave.transactions.sign(tx, pk);
    await arweave.transactions.post(tx);

    return tx.id;
  } catch (error) {
    console.log(error);
    return false;
  }
}
