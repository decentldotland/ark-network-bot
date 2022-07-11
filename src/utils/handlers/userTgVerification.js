import {
  evaluateContractState,
  decryptTelegramUsernameFromState,
} from "../arweave.js";
import { ARK_ORACLE_ADDRESS } from "../constants.js";

export async function canBeVerified(telegram_username, identity_id) {
  try {
    const ark_state = await evaluateContractState(ARK_ORACLE_ADDRESS);
    const decoded_state = await decryptTelegramUsernameFromState(ark_state);
    const userIndex = decoded_state.identities.findIndex(
      (user) => user["identity_id"] === identity_id
    );
    // user not found
    if (userIndex === -1) {
      return { res: false };
    }

    const userProfile = decoded_state.identities[userIndex];
    const userArAddr = userProfile.arweave_address;

    // Booleans checks
    const boolIdEqual = userProfile["identity_id"] === identity_id;
    const boolUsernameEqual =
      userProfile["dec_telegram_username"].toUpperCase() ===
      `@${telegram_username.toUpperCase()}`;
    const boolEvaluatedTgUsername =
      userProfile.telegram.username &&
      userProfile.telegram.is_verified &&
      userProfile.telegram.is_evaluated;
    const boolEvaluatedUser =
      userProfile.is_verified && userProfile.is_evaluated;

    if (
      !boolIdEqual ||
      !boolUsernameEqual ||
      !boolEvaluatedUser || // can verify only non evaluated or verified users
      !boolEvaluatedTgUsername
    ) {
      return { res: false };
    }

    return { res: true, ar_address: userArAddr };
  } catch (error) {
    console.log(error);
    return { res: false };
  }
}
