import Async from "hyper-async";
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
  add,
  filter,
  pipe,
  uniq,
} from "ramda";
import { removeExpired } from "../util.js";

/**
 * @description Mint
 *
 * @author @jshaw-ar
 * @export
 */
export function mint(env) {
  return (state, action) => {
    return of(state.mint_contract)
      .chain(fromPromise(readContractState))
      .map(({ requests }) => requests)
      .map(toPairs)
      .map(removeExpired)
      .map(notInPile(state, __))
      .map(keyTargetQty) // ["addr", {qty, target}]
      .fork(
        (e) => {
          throw new ContractError("An error occurred.");
        },
        (requests) =>
          of({ state, requests })
            .map(addToPile)
            .map(setBalances)
            .map(updateBalances)
            .fork(
              (e) => {
                throw new ContractError("An error occurred.");
              },
              ({ state }) => ({ state })
            )
      );
  };
}

const readContractState = async (contract) =>
  SmartWeave.contracts.readContractState(contract);

/**
 * @description Converts a pair to an array of it's key (tx) and {qty(integer), target(address)}
 *
 * @author @jshaw-ar
 * @export
 * @param {Array} pairs
 * @return {Array} pairs
 */
const keyTargetQty = (pairs) =>
  map((r) => [r[0], { qty: r[1].qty, target: r[1].target }], pairs);

/**
 * @description Returns pairs (requests) that haven't been processed
 *
 * @author @jshaw-ar
 * @export
 * @param {Object} state
 * @param {Array} pairs
 * @return {Array} pairs
 */
export const notInPile = (state, pairs) => {
  const isGood = (p) => !state.pile[p[0]];
  return filter(isGood, pairs);
};

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
    pile: [...pipe(uniq(__))([...map((r) => r[0], requests), ...state.pile])],
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
const setBalances = ({ state, requests }) => ({
  state: map((p) => setBalance(p, state), requests)[0],
  requests: requests,
});

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
  state: map((p) => updateBalance(state, p), requests)[0],
  requests,
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
const updateBalance = (state, pair) => ({
  ...state,
  balances: over(lensProp(pair[1].target), add(pair[1].qty), state.balances),
});
