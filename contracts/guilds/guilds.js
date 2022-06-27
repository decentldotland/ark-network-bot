/**
 *
 *
 *
 *         ░█████╗░██████╗░██╗░░██╗        ███╗░░██╗███████╗████████╗░██╗░░░░░░░██╗░█████╗░██████╗░██╗░░██╗
 *         ██╔══██╗██╔══██╗██║░██╔╝        ████╗░██║██╔════╝╚══██╔══╝░██║░░██╗░░██║██╔══██╗██╔══██╗██║░██╔╝
 *         ███████║██████╔╝█████═╝░        ██╔██╗██║█████╗░░░░░██║░░░░╚██╗████╗██╔╝██║░░██║██████╔╝█████═╝░
 *         ██╔══██║██╔══██╗██╔═██╗░        ██║╚████║██╔══╝░░░░░██║░░░░░████╔═████║░██║░░██║██╔══██╗██╔═██╗░
 *         ██║░░██║██║░░██║██║░╚██╗        ██║░╚███║███████╗░░░██║░░░░░╚██╔╝░╚██╔╝░╚█████╔╝██║░░██║██║░╚██╗
 *         ╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝        ╚═╝░░╚══╝╚══════╝░░░╚═╝░░░░░░╚═╝░░░╚═╝░░░╚════╝░╚═╝░░╚═╝╚═╝░░╚═╝
 *
 * @title: Ark Network Guilds Registry
 * @version 0.0.1
 * @author: charmful0x
 * @license: MIT
 * @website ark.decent.land
 *
 **/

export async function handle(state, action) {
  const input = action.input;
  const caller = action.caller;

  const ark_oracle = state.ark_oracle;

  // ERRORS
  const ERROR_CALLER_NOT_REGISTERED_IN_ARK = `caller's has not create a profile in Ark Protocol`;
  const ERROR_ARWEAVE_NETWORK = `cannot load Ark Protocol oracle address due to network errors`;
  const ERROR_INVALD_CALLER = `only the contract admins can invoke this function`;
  const ERROR_GUILD_NOT_FOUND = `cannot find a guild with the given guild_id`;
  const ERROR_INVALID_NAME_TYPE = `guild's name must be a string`;
  const ERROR_INVALID_NAME_LENGTH = `the guild's name length must be between 2 and 99 chars`;
  const ERROR_INVALID_ARWEAVE_ADDRESS = `invalid PST/aNFT token contract address syntax`;
  const ERROR_INVALID_THRESHOLD_TYPE = `the guild's token threshold be a number`;
  const ERROR_NULL_THRESHOLD = `threshold must be greater than zero`;
  const ERROR_ALREADY_ADMIN = `the given address has been added already as admin`;

  // PUBLIC FUNCTIONS
  if (input.function === "createGuild") {
    /***
     *
     * @dev the caller create a new guild object, that's
     * linkable with a Telegram group via the TG bot. In
     * this Guilds release, only PSTs/aNFTs are supported
     * for token-gated guilds creation.
     *
     * @param name guild's name
     * @param token_address the PST/aNFT SWC address
     * @param threshold the min entry requirement
     *
     * @return state
     *
     **/
    const name = input.name;
    const token_address = input.token_address;
    const token_threshold = input.token_threshold;

    _handleGuildName(name);
    _validateThreshold(token_threshold);
    _validateArAddrSyntax(token_address);

    const identities = await _fetchOracle();

    const callerIndexInArk = identities.findIndex(
      (user) => user.arweave_address === caller
    );

    ContractAssert(callerIndexInArk !== -1, ERROR_CALLER_NOT_REGISTERED_IN_ARK);
    const userProfile = identities[callerIndexInArk];

    if (
      userProfile.is_evaluated &&
      userProfile.is_verified &&
      !!userProfile.telegram_username
    ) {
      state.guilds_tokens.push(token_address);

      state.guilds.push({
        guild_name: name,
        guild_id: SmartWeave.transaction.id,
        guild_token: token_address,
        guild_threshold: token_threshold,
        owner_address: caller,
        owner_tg: userProfile.telegram_username, // encrypted in AES
        is_linked: false,
        group_id: null, 
      });

      return { state };
    }

    throw new ContractError(ERROR_ARWEAVE_NETWORK);
  }

  // ADMIN FUNCTIONS
  if (input.function === "verifyGuild") {
    /**
     *
     * @dev this contract admins invoke this function
     * to verify the guild's validity after validating
     * it using the bot's backend logic.
     *
     * @param guild_id the guild's Arweave creation TXID
     * @param group_id the Telegram's group id encrypted in AES
     *
     * @return state
     *
     **/
    const guild_id = input.guild_id;
    const group_id = input.group_id;

    ContractAssert(state.admins.includes(caller), ERROR_INVALD_CALLER);

    const guildIndex = state.guilds.findIndex(
      (guild) => guild["guild_id"] === guild_id
    );

    ContractAssert(guildIndex !== -1, ERROR_GUILD_NOT_FOUND);

    state.guilds[guildIndex].is_linked = true;
    state.guilds[guildIndex].group_id = group_id;

    return { state };
  }

  if (input.function === "addAdmin") {
    /**
     *
     * @dev contract admins can add new admins addrs.
     *
     * @param address the new admin's Arweave addr.
     *
     * @return state
     *
     **/
    const address = input.address;

    _validateArAddrSyntax(address);

    ContractAssert(state.admins.includes(caller), ERROR_INVALD_CALLER);
    ContractAssert(!state.admins.includes(address), ERROR_ALREADY_ADMIN);

    state.admins.push(address);

    return { state };
  }

  if (input.function === "updateOracleAddress") {
    /**
     *
     * @dev update the Ark Protocol Arweave Oracle SWC address
     *
     * @param address the new oracle SWC address
     *
     * @return state
     *
     **/
    const address = input.address;

    _validateArAddrSyntax(address);

    ContractAssert(state.admins.includes(caller), ERROR_INVALD_CALLER);
    state.ark_oracle = address;

    return { state };
  }

  async function _fetchOracle() {
    const state = await SmartWeave.contracts.readContractState(ark_oracle);

    return state.identities;
  }

  //HELPER FUNCTIONS
  function _handleGuildName(name) {
    ContractAssert(typeof name === "string", ERROR_INVALID_NAME_TYPE);
    const trimmed = name.trim();
    ContractAssert(1 < trimmed.length < 100, ERROR_INVALID_NAME_LENGTH);

    return trimmed;
  }

  function _validateArAddrSyntax(address) {
    ContractAssert(
      /[a-z0-9_-]{43}/i.test(address),
      ERROR_INVALID_ARWEAVE_ADDRESS
    );
  }

  function _validateThreshold(threshold) {
    ContractAssert(typeof threshold === "number", ERROR_INVALID_THRESHOLD_TYPE);
    ContractAssert(threshold > 0, ERROR_NULL_THRESHOLD);
  }
}
