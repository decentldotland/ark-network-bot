import axios from "axios";
import "../setEnv.js";

export async function getAddressBalance(token_contract, user_address) {
  try {
    const re = (
      await axios.get(
        `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${token_contract}&address=${user_address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`
      )
    )?.data;

    const balance = re?.message === "OK" ? Number(re.result) : 0;

    return balance;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
