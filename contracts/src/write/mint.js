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
export function mint({ viewContractState, block }) {
  return (state, action) => {
    return of(state.mint_contract)
      .chain((id) =>
        fromPromise(viewContractState)(id, { function: 'get-queue' })
      )
      .map(({ result }) => result)
      .map(toPairs)
      .map((pairs) => removeExpired(pairs, block.height))
      .map((pairs) => notInPile(state, pairs))
      .map((requests) => {
        for (let i = 0; i < requests.length; i++) {
          const tx = requests[i][0];
          const req = requests[i][1];
          const balance = state.balances[req.target] || 0;
          state.pile.push(tx);
          state.balances[req.target] = balance + req.qty;
        }
        return { state, requests };
      });
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
