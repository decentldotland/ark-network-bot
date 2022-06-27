import {
  arweaveCacheRequest,
  evaluateCacheContractState,
} from "./arweave-cache.js";
import NodeCache from "node-cache";
import base64url from "base64url";
import "../setEnv.js";

const cacheState = new NodeCache();

export async function cacheUserRequest(enc_username, enc_group_id) {
  try {
    // initialize cache object
    if (!cacheState.has("requests")) {
      const cachePermanentState = await evaluateCacheContractState();
      const encodedInput = base64url(
        JSON.stringify([{ enc_username, enc_group_id }])
      );

      if (cachePermanentState) {
        cacheState.set("requests", JSON.stringify(cachePermanentState));
      } else {
        // fallback to the new cache incase Arweave gateways
        // failed with reading the cache contract state
        cacheState.set("requests", encodedInput);
      }

      await arweaveCacheRequest(enc_username, enc_group_id);
      return;
    }

    const encodedCachedRequests = cacheState.get("requests");
    const decodedCachedRequests = JSON.parse(
      base64url.decode(encodedCachedRequests)
    );

    decodedCachedRequests.push({ enc_username, enc_group_id });

    cacheState.set(
      "requests",
      base64url(JSON.stringify(decodedCachedRequests))
    );

    await arweaveCacheRequest(enc_username, enc_group_id);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function hasRequestedToJoin(enc_username, enc_group_id) {
  try {
    const cachedRequests = cacheState.get("requests");

    if (!cachedRequests) {
      return false;
    }

    const decodedCachedRequests = JSON.parse(base64url.decode(cachedRequests));

    const userExistence = decodedCachedRequests.findIndex(
      (user) =>
        user["enc_username"] === enc_username &&
        user["enc_group_id"] === enc_group_id
    );

    const re = userExistence === -1 ? false : true;
    return re;
  } catch (error) {
    console.log(error);
    // return true incase any error happend to
    // prevent un-permissioned guild entries
    return true;
  }
}
