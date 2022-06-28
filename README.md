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

## License
This project is licensed under the [MIT license](./LICENSE)
