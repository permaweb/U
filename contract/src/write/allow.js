import { of, fromNullable } from "../hyper-either.js";
import { ce } from "../util.js";

export function allow(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ce(!action.input?.target, "Please specify a target."))
    .chain(
      ce(action.input?.target === action.caller, "Target cannot be caller.")
    )
    .chain(
      ce(
        !Number.isInteger(state.balances[action.caller]),
        "Caller does not have a balance."
      )
    )
    .chain(ce(!Number.isInteger(action.input?.qty), "qty must be an integer."))
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
    .fold(
      (msg) => {
        throw new ContractError(msg || "An error occurred.");
      },
      ({ state, action }) => {
        const { input, caller } = action;
        const { target, qty } = input;
        const { balances, claimable } = state;
        if (!balances[target]) balances[target] = 0;
        balances[caller] -= qty;

        claimable.push({
          from: caller,
          to: target,
          qty,
          tx: SmartWeave.transaction.id,
        });
        return { state };
      }
    );
}
