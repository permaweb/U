import Async from 'hyper-async';
const { of, fromPromise } = Async;
import { removeExpired } from '../util.js';

/**
 * @description Mint
 *
 * @author @jshaw-ar
 * @export
 */
export function mint({}) {
  return (state) => {
    // remove expired requests in the pile to prevent state bloat.
    state.pile = Object.fromEntries(
      Object.entries(state.pile).filter((e) => e[1] >= SmartWeave.block.height)
    );
    return of(state.mint_contract)
      .chain((id) =>
        fromPromise(SmartWeave.contracts.viewContractState)(id, {
          function: 'get-queue',
        })
      )
      .map(({ result }) => result)
      .map((queue) => removeExpired(queue, SmartWeave.block.height))
      .map((queue) => notInPile(state, queue))
      .map(combineQuantitiesByTarget)
      .map(({ requests, combinedTargets }) =>
        updateBalances(combinedTargets, requests, state)
      )
      .map((queue) => {
        for (let i = 0; i < queue.length; i++) {
          const tx = queue[i]?.tx;
          const expires = queue[i]?.expires;
          state.pile[tx] = expires;
        }
      })
      .map(() => ({ state }));
  };
}

/**
 * @description Returns pairs (requests) that haven't been processed
 *
 * @author @jshaw-ar
 * @export
 * @param {Object} state
 * @param {Array} pairs
 * @return {Array} pairs
 */
export const notInPile = (state, requests) => {
  const set = new Set(Object.keys(state.pile));
  return requests.filter((request) => !set.has(request.tx));
};

/**
 * @description Combines quantities by target in the given array of requests.
 * @author @jshaw-ar
 * @param {Array<{ target: string, qty: number }>} requests - The array of requests.
 * @returns {{ combinedTargets: Array<{ target: string, qty: number }>, requests: Array<{ target: string, qty: number }> }} The combined targets and original requests.
 */
function combineQuantitiesByTarget(requests) {
  const combinedMap = new Map();

  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    if (combinedMap.has(request.target)) {
      combinedMap.set(
        request.target,
        combinedMap.get(request.target) + request.qty
      );
    } else {
      combinedMap.set(request.target, request.qty);
    }
  }

  const combinedTargets = Array.from(combinedMap, ([target, qty]) => ({
    target,
    qty,
  }));

  return {
    combinedTargets,
    requests,
  };
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {*} combinedTargets
 * @param {*} pairs
 * @param {*} kv
 * @return {*}
 */
const updateBalances = (combinedTargets, requests, state) => {
  for (let i = 0; i < combinedTargets.length; i++) {
    const req = combinedTargets[i];
    const target = req.target;
    const qty = req.qty;
    const balance = state.balances[target] || 0;
    state.balances[target] = balance + qty;
  }
  return requests;
};
