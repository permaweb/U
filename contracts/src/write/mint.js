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
} from "ramda";
import { removeExpired } from "../util.js";
// this shoud query the L1 contract for a transaction with a tx
// TODO:
// - add to "pile"
// - check that the request has not been processed.
export function mint(env) {
  return (state, action) => {
    return of(state.mint_contract)
      .chain(fromPromise(readContractState))
      .map(({ requests }) => requests)
      .map(toPairs)
      .map(removeExpired)
      .map(keyWithQty) // ["addr", qty]
      .fork(
        (e) => {
          throw new ContractError("An error occurred.");
        },
        (requests) =>
          of({ state, requests })
            .map(filterNotInPile)
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

const keyWithQty = (pairs) => {
  return map((r) => [r[0], r[1].qty], pairs);
};

const filterNotInPile = ({ state, requests }) => ({
  state,
  requests: requests, // filter out ones in pile
});
const addToPile = ({ state, requests }) => ({
  state: {
    ...state,
    // add requests to pile
  },
  requests: requests,
});
const setBalances = ({ state, requests }) => ({
  state: map((p) => setBalance(p, state), requests)[0],
  requests: requests,
});

/**
 * @description Sets target balance to 0 if it does not exist
 *
 * @author Tom Wilson
 * @export
 * @param {{ state, action }}
 * @return {{ state, action }}
 */
export const setBalance = (pair, state) => {
  return {
    ...state,
    balances: over(
      lensProp(pair[0]),
      ifElse(isNil, always(0), identity),
      state.balances
    ),
  };
};

const updateBalances = ({ state, requests }) => ({
  state: map((p) => updateBalance(p, state), requests)[0],
  requests,
});

/**
 * @description Adds qty to target balance
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {Array} pair // pair[0] (address) pair[1] qty
 * @return {state}
 */
const updateBalance = (pair, state) => {
  return {
    ...state,
    balances: over(lensProp(pair[0]), add(pair[1]), state.balances),
  };
};
