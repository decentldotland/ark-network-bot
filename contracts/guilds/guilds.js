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
 * @version 0.0.3
 * @author charmful0x
 * @license MIT
 * @website ark.decent.land
 *
 **/

export async function handle(state, action) {
  const input = action.input;
  const caller = action.caller;

  const ark_oracle = state.ark_oracle;
  const token_types = state.token_types;

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
  const ERROR_INVALID_EVM_ADDRESS = `invalid EVM contract address syntax`;
  const ERROR_INVALID_TOKEN_TYPE = `invalid token type`;
  const ERROR_INVALID_TOKEN_PRECISION = `token decimals must be an integer`;
  const ERROR_TYPE_ALREADY_ADDED = `the given token type has been already added`;
  const ERROR_MISSING_ARGUMENTS = `the function has no passed arguments`;
  const ERROR_CALLER_NOT_OWNER = `only the guild owner can invoke this function`;

  // PUBLIC FUNCTIONS
  if (input.function === "createGuild") {
    /**
     *
     * @dev the caller create a new guild object, that's
     * linkable with a Telegram group via the TG bot. The
     * supported token types (network's tokens) are stated
     * in the SWC's state for token-gated guilds creation.
     *
     * @param name guild's name
     * @param token_address the token contract address
     * @param token_type the type of the contract's token
     * @param token_decimals the token's precision
     * @param threshold the min entry requirement
     *
     * @return state
     *
     **/
    const name = input.name;
    const description = input.description;
    const token_address = input.token_address;
    const token_type = input.token_type;
    const token_decimals = input.token_decimals;
    const token_threshold = input.token_threshold;

    _handleGuildName(name);
    _validateThreshold(token_threshold);

    const tokenType = _handleTokenType(token_type, token_decimals);

    tokenType === "PST-ANFT"
      ? _validateArAddrSyntax(token_address)
      : _validateEvmAddrSyntax(token_address);

    const identities = await _fetchOracle();

    const callerIndexInArk = identities.findIndex(
      (user) => user.arweave_address === caller
    );

    ContractAssert(callerIndexInArk !== -1, ERROR_CALLER_NOT_REGISTERED_IN_ARK);
    const userProfile = identities[callerIndexInArk];

    if (
      userProfile.is_evaluated &&
      userProfile.is_verified &&
      !!userProfile.telegram.username
    ) {
      state.guilds_tokens.push(token_address);

      state.guilds.push({
        guild_name: name,
        guild_description: description,
        guild_id: SmartWeave.transaction.id,
        guild_token: token_address,
        guild_threshold: token_threshold,
        token_type: token_type,
        token_decimals: token_decimals,
        owner_address: caller,
        owner_tg: userProfile.telegram.username, // encrypted in AES
        is_linked: false,
        group_id: null,
      });

      return { state };
    }

    throw new ContractError(ERROR_ARWEAVE_NETWORK);
  }

  if (input.function === "updateGuild") {
    /**
     *
     * @dev guild creator can invoke this
     * function to update his guild's metadata
     *
     * @param guild_id the unique ID of the guild (TXID)
     * @param name new guild's name
     * @param description new guild's description
     * @param token_threshold new guild's threshold
     *
     * @return state
     *
     **/
    const guild_id = input.guild_id;
    const name = input.name;
    const description = input.description;
    const token_threshold = input.token_threshold;
    // at least one parameter must have assigned value
    ContractAssert(
      name || description || token_threshold,
      ERROR_MISSING_ARGUMENTS
    );

    const guildIndex = _getGuildIndex(guild_id);
    const guild = state.guilds[guildIndex];
    // only the guild creator can update the guild metadata
    ContractAssert(guild.owner_address === caller, ERROR_CALLER_NOT_OWNER);

    if (name) {
      guild.guid_name = name;
    }

    if (description) {
      guild.guild_description = description;
    }

    if (token_threshold) {
      _validateThreshold(token_threshold);
      guild.guild_threshold = token_threshold;
    }

    return { state };
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

  if (input.function === "addTokenType") {
    /**
     *
     * @dev contract admins can add new admins addrs.
     *
     * @param token_type the token's type key.
     *
     * @return state
     *
     **/
    const token_type = input.token_type;

    ContractAssert(state.admins.includes(caller), ERROR_INVALD_CALLER);
    ContractAssert(!token_types.includes(token_type), ERROR_TYPE_ALREADY_ADDED);

    token_types.push(token_type);

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

  function _validateEvmAddrSyntax(address) {
    ContractAssert(
      /^0x[a-fA-F0-9]{40}$/.test(address),
      ERROR_INVALID_EVM_ADDRESS
    );
  }

  function _validateThreshold(threshold) {
    ContractAssert(typeof threshold === "number", ERROR_INVALID_THRESHOLD_TYPE);
    ContractAssert(threshold > 0, ERROR_NULL_THRESHOLD);
  }

  function _handleTokenType(token_type, token_decimals) {
    const typeIndex = token_types.findIndex((type) => type === token_type);

    ContractAssert(typeIndex !== -1, ERROR_INVALID_TOKEN_TYPE);
    ContractAssert(
      Number.isInteger(token_decimals),
      ERROR_INVALID_TOKEN_PRECISION
    );

    return token_types[typeIndex];
  }

  function _getGuildIndex(guild_id) {
    const guildIndex = state.guilds.findIndex(
      (guild) => guild["guild_id"] === guild_id
    );
    ContractAssert(guildIndex !== -1, ERROR_GUILD_NOT_FOUND);

    return guildIndex;
  }
}
