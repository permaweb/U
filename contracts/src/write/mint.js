import Async from 'hyper-async';
const { of, fromPromise } = Async;
import { removeExpired } from '../util.js';

/**
 * @description Mint
 *
 * @author @jshaw-ar
 * @export
 */
export function mint({ viewContractState, block, kv }) {
  return (state, action) => {
    return of(state.mint_contract)
      .chain((id) =>
        fromPromise(viewContractState)(id, { function: 'get-queue' })
      )
      .map(({ result }) => result)
      .map((queue) => removeExpired(queue, block.height))
      .map((queue) => notInPile(state, queue))
      .map(combineQuantitiesByTarget)
      .chain(({ requests, combinedTargets }) =>
        fromPromise(updateBalances)(combinedTargets, requests, kv)
      )
      .map((queue) => {
        for (let i = 0; i < queue.length; i++) {
          const tx = queue[i].tx;
          state.pile.push(tx);
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
export const notInPile = (state, requests) =>
  requests.filter((request) => !state.pile.includes(request.tx));

/**
 * @description Combines any targets that are the same and returns the combined qty
 *
 * @author @jshaw-ar
 * @param {*} requests
 * @return {*}
 */
function combineQuantitiesByTarget(requests) {
  const combinedArr = [];

  requests.forEach((request) => {
    const existingTargetIndex = combinedArr.findIndex(
      (combinedItem) => combinedItem.target === request.target
    );

    if (existingTargetIndex !== -1) {
      combinedArr[existingTargetIndex].qty += request.qty;
    } else {
      combinedArr.push({ target: request.target, qty: request.qty });
    }
  });

  return {
    combinedTargets: combinedArr,
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
const updateBalances = async (combinedTargets, requests, kv) => {
  for (let i = 0; i < combinedTargets.length; i++) {
    const req = combinedTargets[i];
    const target = req.target;
    const qty = req.qty;
    const balance = (await kv.get(target)) || 0;
    await kv.put(target, balance + qty);
  }
  return requests;
};
