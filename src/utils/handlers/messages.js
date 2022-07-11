export async function msgGuildSuccess(
  ctx,
  guild_id,
  username,
  verification_id
) {
  const messageText =
    "✅ <b>Guild Linked</b> ✅" +
    `\n\n<i><b>-guild_id:</b></i> <code>${guild_id} </code>` +
    `\n<i><b>-registrant:</b></i> @${username}` +
    `\n<i><b>-verification TXID:</b></i> <a href="https://viewblock.io/arweave/tx/${verification_id}">${verification_id}</a>`;

  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgInvalidChatType(ctx, must_be) {
  const keyword = must_be === "supergroup" ? "group" : "private";

  const messageText = `<b>❗️ This Ark bot command can be invoked only in ${keyword} chat ❗️</b>`;
  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgOnlyAdmin(ctx) {
  const messageText = `<b>❗️ Only the group creator/admin can invoke this command ❗️</b>`;
  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgSendInvitation(ctx, invitation_url, guild_id) {
  const messageText =
    `<b>Welcome to the Telegram guild!</b>\n\n` +
    `- guild ID: <code>${guild_id}</code>\n` +
    `- joining link: ${invitation_url}`;

  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgBotNotAdmin(ctx) {
  const messageText = `<b>❗️ You must give the bot admin privileges before linking the guild! ❗️</b>`;

  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgGuildFailure(ctx) {
  const messageText = `<b>❗️ cannot link the guild with the given ID ❗</b>`;

  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgGuildNotFound(ctx) {
  const messageText = `<b>❗️ The guild you are trying to join has not been found or not activated yet ❗️</b>`;

  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgUserReentrancy(ctx) {
  const messageText = `<b>You already exist in the guild of the Telegram group that you are trying to join!</b>`;

  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgArkIdentityVoid0(ctx) {
  const messageText =
    `<b>❗️ Cannot find an Ark Protocol identity associated with your current Telegram profile ❗️</b>` +
    `\n\nTo create link your identity over Ark Protocol, please visit <a href="https://decent.land">ark.decent.land</a>`;

  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgCantJoinGuild(ctx) {
  const messageText = `<b>❗️ Cannot join the guild, please make sure you have the guild's min token threshold ❗️</b>`;

  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgDuplicatedRequests(ctx) {
  const messageText = `<b>❗️ You have been already invited to this group. Cannot generate a new invite URL ❗️</b>`;

  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgLoading(ctx) {
  const messageText = `<b>🔮 loading some stuff, please wait 🔮</b>`;

  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgTgIdentityUnverified(ctx, verification_id) {
  const messageText =
    `<b>❗️ Cannot verify your Telegram account with the given Ark identity ID ❗️</b>` +
    `\n verification TXID (unverified telegram username): <a href="https://viewblock.io/arweave/tx/${verification_id}">${verification_id}</a>`;
  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}

export async function msgTgIdentityVerified(ctx, verification_id) {
  const messageText =
    `<b>✅ Your Telegram account has been linked to your Ark identity ID ✅</b>` +
    `\n verification TXID (verified telegram username): <a href="https://viewblock.io/arweave/tx/${verification_id}">${verification_id}</a>`;
  ctx.telegram.sendMessage(ctx.message.chat.id, messageText, {
    parse_mode: "HTML",
  });
}
