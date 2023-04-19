import BigNumber from "bignumber.js";
import { assoc, __, over, lensProp, identity, subtract } from "ramda";

import { of, fromNullable } from "../hyper-either.js";
import { ce, qtyToNumber } from "../util.js";

export function allow(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ce(!action.input?.target, "Please specify a target."))
    .chain(
      ce(action.input?.target === action.caller, "Target cannot be caller.")
    )
    .chain(
      ce(
        !new BigNumber(state.balances[action.caller]).isInteger(),
        "Caller does not have a balance."
      )
    )
    .chain(
      ce(
        !new BigNumber(action.input?.qty).isInteger(),
        "qty must be an integer."
      )
    )
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
    .map(setCallerBalance)
    .map(createClaim)
    .map(assoc("state", __, {}))
    .fold((msg) => {
      throw new ContractError(msg || "An error occurred.");
    }, identity);
}

function setCallerBalance({ state, action }) {
  return {
    state: {
      ...state,
      balances: over(
        lensProp(action.caller),
        subtract(action.input.qty),
        state.balances
      ),
    },
    action,
  };
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
        tx: SmartWeave.transaction.id,
      },
    ],
  };
}
