import { assoc, __, identity } from "ramda";

import { of, fromNullable } from "../hyper-either.js";
import { ce, isInteger, qtyToNumber, subtractCallerBalance } from "../util.js";

export function allow(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ce(!action.input?.target, "Please specify a target."))
    .chain(
      ce(action.input?.target === action.caller, "Target cannot be caller.")
    )
    .chain(
      ce(
        !isInteger(state.balances[action.caller]),
        "Caller does not have a balance."
      )
    )
    .chain(ce(!isInteger(action.input?.qty), "qty must be an integer."))
    .chain(
      ce(
        action.input?.qty < 1,
        "Invalid token transfer. qty must be an integer greater than 0."
      )
    )
    .chain(
      ce(
        state.balances[action.caller] < action.input?.qty,
        "Not enough tokens for allow."
      )
    )
    .map(qtyToNumber)
    .map(subtractCallerBalance)
    .map(createClaim)
    .map(assoc("state", __, {}))
    .fold((msg) => {
      throw new ContractError(msg || "An error occurred.");
    }, identity);
}

function createClaim({ state, action }) {
  return {
    ...state,
    claimable: [
      ...state.claimable,
      {
        from: action.caller,
        to: action.input.target,
        qty: action.input.qty,
        txID: SmartWeave.transaction.id,
      },
    ],
  };
}
