export async function handle(state, action) {
  const caller = action.caller;
  const input = action.input;

  // STATE
  const users = state.users;
  const admins = state.admins;

  // ERRORS
  const ERROR_SHOULD_BE_STRING = `the argument must be passed as a string`;
  const ERROR_SHOULD_NUMBER = `the argument must be passed as a number`;
  const ERROR_ITEM_NOT_FOUND = `cannot find an item with the given index`;
  const ERROR_ALREADY_ADMIN = `the address is an admin already`;
  const ERROR_INVALD_CALLER = `onnly admins can invoke this function`;
  const ERROR_INVALID_ARWEAVE_ADDRESS = `invalid Arweave address syntax`;

  // FUNCTIONS
  if (input.function === "set") {
    // both passed-in encrypted (AES)
    const username = input.username;
    const group_id = input.group_id;

    _isAdmin(caller);

    ContractAssert(typeof username === "string", ERROR_SHOULD_BE_STRING);
    ContractAssert(typeof group_id === "string", ERROR_SHOULD_BE_STRING);

    users.push({ enc_username: username, enc_group_id: group_id });

    return { state };
  }

  if (input.function === "del") {
    const item_index = input.item_index;
    
    _isAdmin(caller);

    ContractAssert(typeof item_index === "number", ERROR_SHOULD_NUMBER);
    ContractAssert(!!users[item_index], ERROR_ITEM_NOT_FOUND);

    users.splice(item_index, 1);

    return { state };
  }

  if (input.function === "addAdmin") {
    const address = input.address;

    _isAdmin(caller);
    _validateArAddrSyntax(address);

    ContractAssert(!admins.includes(address), ERROR_ALREADY_ADMIN);

    admins.push(address);

    return { state };
  }

  // HELPER FUNCTIONS
  function _isAdmin(address) {
    ContractAssert(admins.includes(address), ERROR_INVALD_CALLER);
  }

  function _validateArAddrSyntax(address) {
    ContractAssert(
      /[a-z0-9_-]{43}/i.test(address),
      ERROR_INVALID_ARWEAVE_ADDRESS
    );
  }
}
