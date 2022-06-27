import CryptoJS from "crypto-js";
import "./setEnv.js";

const pk = process.env.VALIDATOR_JWK;

export async function decrypt(enc_string) {
  try {
    const decrypted = await CryptoJS.AES.decrypt(enc_string, pk);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function encrypt(string) {
  try {
    const encypted = await CryptoJS.AES.encrypt(string, pk);
    return encypted.toString();
  } catch (error) {
    console.log(error);
    return false;
  }
}
