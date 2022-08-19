import axios from "axios";

export async function fetchDogeChainBalance(dogechain_address) {
  try {
    const q = {
      query: `query {
      address(hash: "${dogechain_address}") {
          fetchedCoinBalance
          fetchedCoinBalanceBlockNumber
          hash
        }
      }`,
    };
    const res = await axios.post("https://explorer.dogechain.dog/graphiql", q, {
      headers: { "Content-Type": "application/json" },
    });

    if (res?.data?.errors) {
      console.log(0);
      return 0;
    }
    // the normalized balance is handled in ./guilds.js (canJoinGuild() function)
    // wDOGE decimal is 18
    return Number(res?.data?.data?.address.fetchedCoinBalance);
  } catch (error) {
    return 0;
  }
}
