import Async, { Rejected, Resolved } from "./hyper-async";
const { of, fromPromise } = Async;

/**
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @param {string} dre
 * @return {*}
 */
export function getState(tx, dre) {
  return of({ tx, dre })
    .chain(validate)
    .chain(fromPromise(getStateFromDRE))
    .fork(
      (e) => {
        console.log(e);
        return { error: "There was an error fetching the contract state." };
      },
      (state) => state
    );
}

function validate({ tx, dre }) {
  if (!tx || tx.length !== 43) return Rejected("tx is invalid.");
  return Resolved({ tx, dre });
}

async function getStateFromDRE({ tx, dre }) {
  try {
    const response = await fetch(
      `https://${dre || "dre-u"}.warp.cc/contract?id=${tx}`
    );
    if (response.ok) {
      const result = await response.json();
      return result.state;
    }
    throw new Error("There was an error fetching the transaction.");
  } catch (error) {
    throw new Error(error.message);
  }
}
