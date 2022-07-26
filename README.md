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
| BEP20 | `BEP20` |
| ERC20 ETH  | `ERC-ETH`     |
| ERC20 AVAX | `ERC-AVAX` |
| ERC20 FTM | `ERC-FTM` |
| PSTs & aNFTS | `PST-ANFT`     |

#### Contract SWC ID (experimental): [sWR6h_DrFHBS2P2-l1zYFo0R7ufJy32YINM1UVP7f5w](https://viewblock.io/arweave/address/sWR6h_DrFHBS2P2-l1zYFo0R7ufJy32YINM1UVP7f5w?tab=state)
#### Creation interaction:

```json
{
  "function": "createGuild",
  "name": "pancakessss",
  "description": "we love pancakes",
  "token_address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", // BEP20 $CAKE contract address
  "token_decimals": 18, // token's decimals
  "token_type": "BEP20", // token type
  "token_threshold": 0.05 // min amount (inclusive) held by a user to be able to join the guild
}

```

## Tech Stack
- [Ark Protocol](https://github.com/decentldotland/ark-network)
- [Arweave Network](https://arweave.org)
- [Telegram API](https://core.telegram.org/)
- Powered by [Bscscan.com APIs](https://docs.bscscan.com/)
- Powered by [Etherscan.io APIs](https://docs.etherscan.io/)
- Powered by [Ftmscan.com APIs](https://docs.ftmscan.com/)
- Powered by [Snowtrace.io APIs](https://docs.snowtrace.io/)


## License
This project is licensed under the [MIT license](./LICENSE)
