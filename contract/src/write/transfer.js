import BigNumber from "bignumber.js";
import { fromNullable, of } from "../hyper-either.js";
import { ce } from "../util.js";

export function transfer(state, action) {
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
        "Not enough tokens for transfer."
      )
    )
    .fold(
      (msg) => {
        throw new ContractError(msg || "An error occurred.");
      },
      ({ state, action }) => {
        const { input, caller } = action;
        const { target, qty } = input;
        const { balances } = state;
        balances[caller] -= qty;
        if (!balances[target]) {
          balances[target] = 0;
        }
        balances[target] += qty;
        return state;
      }
    );
}
