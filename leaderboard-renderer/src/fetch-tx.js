import Async from "./hyper-async";

const { fromPromise, of } = Async;

export const fetchTx = async (tx) =>
  of(getHost())
    .chain((host) => fromPromise(fetchTxFromGateway)(tx, host))
    .toPromise();

/**
 * @description Gets 'tx' from the query string -- returns null if it doesn't exist
 * @example getTx(window?.location?.search);
 * @author @jshaw_ar
 * @param {string} queryString
 * @return {*} value of tx or null
 */
export async function fetchTxFromGateway(tx, host) {
  const result = await fetch(`https://${host}/${tx}`);
  if (result.ok) {
    return result.json();
  }
  throw new Error("There was an error fetching the transaction.");
}

/**
 * Gets the host to fetch using the gateway currently being used.
 *
 * @author @jshaw-ar
 * @return {*}
 */
function getHost() {
  const urlObj = new URL(window.location.href);
  const host = urlObj.host;
  if (host.includes("localhost")) return "arweave.net";
  return host;
}
