import { of, fromNullable } from "../hyper-either.js";
import { ca } from "../util.js";

export function allow(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ca(!action.input?.target, "Please specify a target."))
    .chain(
      ca(action.input?.target === action.caller, "Target cannot be caller.")
    )
    .chain(
      ca(
        !Number.isInteger(state.balances[action.caller]),
        "Caller does not have a balance."
      )
    )
    .chain(ca(!Number.isInteger(action.input?.qty), "qty must be an integer."))
    .chain(
      ca(
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
