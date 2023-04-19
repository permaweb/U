import { of, fromNullable } from "../hyper-either.js";
import { setCallerBalance } from "../util.js";
import { __, identity, assoc } from "ramda";

export const mint = (state, action) => {
  return of({ state, action })
    .chain(fromNullable)
    .map(setCallerBalance)
    .map(updateBalance)
    .map(assoc("state", __, {}))
    .fold(() => {
      throw new ContractError("An error occured.");
    }, identity);
};

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
