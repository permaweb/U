import { assoc, identity, __, pick } from "ramda";

import { fromNullable, of } from "../hyper-either.js";
import {
  addTargetBalance,
  ce,
  isInteger,
  setTargetBalance,
  subtractCallerBalance,
} from "../util.js";

export function transfer(state, action) {
  return (
    of({ state, action })
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
          "Not enough tokens for transfer."
        )
      )
      .map(setTargetBalance)
      .map(subtractCallerBalance)
      .map(addTargetBalance)
      .map(pick(["state"]))
      // .map(({ state }) => state)
      // .map(assoc("state", __, {}))
      .fold((msg) => {
        throw new ContractError(msg || "An error occurred.");
      }, identity)
  );
}
