import Async from 'hyper-async';
const { of, fromPromise } = Async;
import {
  map,
  toPairs,
  __,
  over,
  lensProp,
  identity,
  ifElse,
  isNil,
  always,
  uniq,
  prop,
  head,
  concat,
  compose,
  reject,
  includes,
  path,
  assoc,
  reduce,
} from 'ramda';
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
      .map(prop('result'))
      .map(toPairs)
      .map((pairs) => removeExpired(pairs, block.height))
      .map(notInPile(state, __))
      .map((requests) => ({ state, requests }))
      .map(addToPile)
      .map(setBalances)
      .map(updateBalances);
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
  reject((pair) => includes(pair[0], state.pile), pairs);

/**
 * @description Adds requests to the "pile" of processed requests
 *
 * @author @jshaw-ar
 * @export
 * @param {Array} pairs
 * @return {Array} pairs
 */
const addToPile = ({ state, requests }) => ({
  state: {
    ...state,
    // combines pile and requests and returns an array of unique values
    pile: compose(uniq, concat(state.pile), map(head))(requests),
  },
  requests: requests,
});

/**
 * @description Sets any balance for the target of a request to 0 if it doesn't exist
 *
 * @author @jshaw-ar
 * @export
 * @param {Object} {state, requests}
 * @return {Object} {state, requests}
 */
const setBalances = ({ state, requests }) => {
  return {
    state: map((p) => setBalance(p, state), requests)[0] || { ...state },
    requests: requests,
  };
};

/**
 * @description Sets a balance to 0 if it doesn't exist
 *
 * @author @jshaw-ar
 * @export
 * @param {Array} pair
 * @return {state} state
 */
export const setBalance = (pair, state) => ({
  ...state,
  balances: over(
    lensProp(pair[1].target),
    ifElse(isNil, always(0), identity),
    state.balances
  ),
});

/**
 * @description Updates balances for all requests
 *
 * @author @jshaw-ar
 * @export
 * @param {{Object, Array}} {state, requests}
 * @return {{Object, Array}} {state, requests}
 */
const updateBalances = ({ state, requests }) => ({
  state: {
    ...state,
    balances: reduce(addQtyToBalance, state.balances, requests),
  },
});

/**
 * @description Adds qty to target balance
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {Array} pair // pair[0] (address) pair[1] {qty, target}
 * @return {state}
 */
const addQtyToBalance = (balances, [txId, { qty, target }]) =>
  assoc(target, path([target], balances) + qty, balances);
