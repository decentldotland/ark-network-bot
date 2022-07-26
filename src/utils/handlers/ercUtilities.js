import axios from "axios";
import "../setEnv.js";

export async function getAddressBalance(
  token_type,
  token_contract,
  user_address
) {
  try {
    const ENDPOINT = await resolveTokenType(token_type);
    const re = (
      await axios.get(
        `https://${ENDPOINT.URL}/api?module=account&action=tokenbalance&contractaddress=${token_contract}&address=${user_address}&tag=latest&apikey=${ENDPOINT.API_KEY}`
      )
    )?.data;

    const balance = re?.message === "OK" ? Number(re.result) : 0;

    return balance;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function resolveTokenType(type) {
  switch (type) {
    case "ERC-ETH":
      return {
        URL: `api.etherscan.io`,
        API_KEY: process.env.ETHERSCAN_API_KEY,
      };
    case "ERC-AVAX":
      return {
        URL: `api.snowtrace.io`,
        API_KEY: process.env.SNOWTRACE_API_KEY,
      };
    case "ERC-FTM":
      return {
        URL: `api.ftmscan.com`,
        API_KEY: process.env.FTMSCAN_API_KEY,
      };
    case "BEP20":
      return {
        URL: `api.bscscan.com`,
        API_KEY: process.env.BSCSCAN_API_KEY,
      };
    default:
      return {
        URL: `api.etherscan.io`,
        API_KEY: process.env.ETHERSCAN_API_KEY,
      };
  }
}
