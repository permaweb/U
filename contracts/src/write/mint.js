import Async from 'hyper-async';
const { of, fromPromise } = Async;
import { toPairs } from 'ramda';
import { removeExpired } from '../util.js';

/**
 * @description Mint
 *
 * @author @jshaw-ar
 * @export
 */
export function mint({ viewContractState, block, kv }) {
  return (state, action) => {
    return (
      of(state.mint_contract)
        .chain((id) =>
          fromPromise(viewContractState)(id, { function: 'get-queue' })
        )
        .map(({ result }) => result)
        // JSHAW: consider moving this to the get-queuea
        // func and only after filtering out expired

        .map(toPairs)
        .map((pairs) => removeExpired(pairs, block.height))
        .map((pairs) => notInPile(state, pairs))
        // Put the requests in the pile
        .map((pairs) => combineTargets(pairs))
        .chain(({ pairs, combinedTargets }) =>
          fromPromise(updateBalances)(combinedTargets, pairs, kv)
        )
        .map((pairs) => {
          for (let i = 0; i < pairs.length; i++) {
            const tx = pairs[i][0];
            state.pile.push(tx);
          }
          return pairs;
        })
        // combine qty for requests with the same target
        .map(() => ({ state }))
    );
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
export const notInPile = (state, pairs) =>
  pairs.filter((pair) => !state.pile.includes(pair[0]));

/**
 * @description Combines the qty of requests for the same wallet address and returns 1
 * qty per wallet.
 *
 * The assumption is that the claims have been added to state.pile and
 * we can combine the targets to update the balance for multiple requests
 * for the same address in 1 interaction
 *
 * @author @jshaw-ar
 * @param {*} pairs
 * @return {Array} [{ "addr": qty }]
 */
function combineTargets(pairs) {
  const result = {};
  for (let i = 0; i < pairs.length; i++) {
    const target = pairs[i][1].target;
    const qty = pairs[i][1].qty;
    if (result[target]) {
      result[target] += qty;
    } else {
      result[target] = qty;
    }
  }
  return {
    combinedTargets: Object.keys(result).map((key) => ({ [key]: result[key] })),
    pairs,
  };
}

const updateBalances = async (requests, pairs, kv) => {
  for (let i = 0; i < requests.length; i++) {
    const req = requests[i];
    const target = Object.keys(req)[0];
    const qty = Object.values(req)[0];
    const balance = (await kv.get(target)) || 0;
    await kv.put(target, balance + qty);
  }
  return pairs;
};
