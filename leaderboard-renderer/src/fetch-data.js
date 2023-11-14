import Async from "./hyper-async";

const { fromPromise, of } = Async;

export const fetchTx = async (tx) =>
  of(getHost())
    .chain((host) => fromPromise(fetchTxFromGQL)(tx, host))
    .toPromise();

/**
 * @description Gets 'tx' from the query string -- returns null if it doesn't exist
 * @example getTx(window?.location?.search);
 * @author @jshaw_ar
 * @param {string} queryString
 * @return {*} value of tx or null
 */
export async function fetchTxFromGQL(tx, host) {
  const result = await fetch(`https://${host}/graphql`, {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.6",
      "content-type": "application/json",
    },
    body: `{"operationName":null,"variables":{},"query":"{\\n  transactions(\\n    first: 100\\n    tags: [{name: \\"Protocol-Name\\", values: [\\"Facts\\"]}, {name: \\"Data-Source\\", values: [\\"${tx}\\"]}]\\n  ) {\\n    edges {\\n      node {\\n        block {\\n          timestamp\\n          height\\n        }\\n        id\\n        owner {\\n          address\\n        }\\n        tags {\\n          name\\n          value\\n        }\\n      }\\n    }\\n  }\\n}\\n"}`,
    method: "POST",
  });

  if (result.ok) {
    return getEdges(await result.json()).map(getNode);
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

export function getEdges(res) {
  if (!res?.data?.transactions?.edges) throw new Error("no edges");
  return res.data.transactions.edges;
}

/**
 * Pulls the node from the edge of the gql query response.
 *
 * @author @jshaw-ar
 * @param {{ node: Transaction }} edge
 * @return {*}  {Transaction}
 */
export function getNode(edge) {
  return edge.node;
}
