import {
  evaluateContractState,
  decryptTelegramUsernameFromState,
} from "../arweave.js";
import { ARK_ORACLE_ADDRESS } from "../constants.js";
import { decrypt } from "../crypto.js";

export async function isGuildLinkable({
  registry_state,
  guild_id,
  caller_username,
} = {}) {
  try {
    const stateWithDecryptedOwners = await decryptedTgOwnersUsernames(
      registry_state
    );
    const guildIndex = stateWithDecryptedOwners.guilds.findIndex(
      (guild) =>
        guild["guild_id"] === guild_id &&
        guild?.["dec_owner_tg"] == caller_username &&
        !guild["is_linked"]
    );

    console.log("FOUND GUILD INDEX", guildIndex);
    if (guildIndex === -1) {
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function isActiveGuild(registry_state, guild_id) {
  try {
    const guildIndex = registry_state.guilds.findIndex(
      (guild) => guild["guild_id"] === guild_id && guild["is_linked"] == true
    );
    if (guildIndex === -1) {
      return { status: false };
    }

    return { status: true, guild: registry_state.guilds[guildIndex] };
  } catch (error) {
    console.log(error);
    return { status: false };
  }
}

export async function canJoinGuild(user_address, guild_object) {
  try {
    const pstState = await evaluateContractState(guild_object.guild_token);
    const userBalance = pstState?.balances?.[user_address];
    const canJoin = userBalance >= guild_object.guild_threshold ? true : false;

    return canJoin;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getUserArkProfile(telegram_username) {
  try {
    const ark_state = await evaluateContractState(ARK_ORACLE_ADDRESS);
    const decoded_state = await decryptTelegramUsernameFromState(ark_state);
    const profile = decoded_state.identities.find(
      (user) =>
        user["dec_telegram_username"].toUpperCase() ===
        `@${telegram_username}`.toUpperCase()
    );

    return profile ? profile : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function decryptedTgOwnersUsernames(registry_state) {
  try {
    for (const guild of registry_state.guilds) {
      if (guild.owner_tg) {
        guild.dec_owner_tg = (await decrypt(guild.owner_tg)).toUpperCase();
      }
    }

    return registry_state;
  } catch (error) {
    console.log(error);
  }
}
