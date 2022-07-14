import { getUserArkProfile } from "./guild.js";
import { msgProfileStatusFound, msgProfileStatusNotFound } from "./messages.js";

export async function getProfileStatus(ctx, telegram_username) {
  try {
    const profile = await getUserArkProfile(telegram_username);
    if (!profile) {
      await msgProfileStatusNotFound(ctx, telegram_username);
      return;
    }

    await msgProfileStatusFound(ctx, profile);
  } catch (error) {
    console.log(error);
  }
}
