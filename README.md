<p align="center">
  <a href="https://decent.land">
    <img src="./img/logo25.png" height="124">
  </a>
  <h3 align="center"><code>@decentdotland/ark-network-bot</code></h3>
  <p align="center">For token-gated Telegram groups</p>
</p>

## Synopsis
Ark Network Bot is a Telegram bot that relies on the [Ark Network](https://github.com/decentldotland/ark-network) and [Telegram API](https://core.telegram.org/) to facilitate token-gated guilds on Telegram.

## Status
- Development: PoC - alpha release.
- Desc: The current release supports only Arweave tokens standards: PSTs (Profit Sharing Tokens) and aNFTs (Atomic NFTs). The bot can be extended to support
all of the protocols and chains integrated in the Ark Network.

## Install
```sh
git clone https://github.com/decentldotland/ark-network-bot.git

cd ark-network-bot

npm install .
```

## Contracts 
The list of SmartWeave contract used by this bot

| name  | path | description |
| ------------- |-------------| ------------- |
| onchain requests cache      | [./contracts/cache-contract](./contracts/cache-contract) | encypted onchain cache for user's logs of joining a guild |
| guilds registry      | [./contracts/guilds](./contracts/guilds)    | registry contract for the created guilds |


## Guild Creation
Creating a guild does not require an existing Telegram group to link it directly, instead, the guild can be bound to a group anytime after creation.

### Supported token types

| Tokens  | KEY |
| ------------- |:-------------:|
| PSTs & aNFTS      | `PST-ANFT`     |
| ERCs      | `ERC`     |

#### Contract SWC ID (experimental): [v1WaNWwNmOE7XG_UFvTBwlfMn1OXCaROjZwZHxLu-rI](https://viewblock.io/arweave/address/v1WaNWwNmOE7XG_UFvTBwlfMn1OXCaROjZwZHxLu-rI?tab=state)
#### Creation interaction:

```json
{
  "function": "createGuild",
  "name": "stablez hoooldersss",
  "description": "a guild for USDC holdoooors only",
  "token_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // ERC20 USDC contract address
  "token_decimals": 6, // token's decimals
  "token_type": "ERC", // token type
  "token_threshold": 1 // min amount (inclusive) held by a user to be able to join the guild
}

```

## Tech Stack
- [Telegram API](https://core.telegram.org/)
- Powered by [Etherscan.io APIs](https://docs.etherscan.io/)
- [Arweave Network](https://arweave.org)
- [Ark Protocol](https://github.com/decentldotland/ark-network)

## License
This project is licensed under the [MIT license](./LICENSE)
