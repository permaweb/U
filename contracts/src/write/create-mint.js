import { of, fromNullable } from "../hyper-either.js";
import { setCallerBalance } from "../util.js";
import { __, identity, assoc } from "ramda";

export async function mint(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .map(setCallerBalance)
    .map(updateBalance)
    .map(assoc("state", __, {}))
    .fold((msg) => {
      throw new ContractError(msg || "An error occurred.");
    }, identity);
}

function updateBalance({ state, action }) {
  return {
    ...state,
    balances: {
      ...state.balances,
      [action.caller]:
        state.balances[action.caller] +
        Math.floor(parseInt(SmartWeave.transaction.reward) / 1e6),
    },
  };
}
