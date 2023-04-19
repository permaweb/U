import { fromNullable, of } from "../hyper-either.js";
import { ce } from "../util.js";

/**
 * Claims rebAR from claimables
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*}
 */
export function claim(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(
      ce(!action.input?.txID, "txID must be passed to the claim function.")
    )
    .chain(ce(!action.input?.qty, "A qty must be specified."))
    .chain(
      ce(state.claims.includes(action.input?.txID), "Claim already processed.")
    )
    .chain(
      ce(
        !(
          state.claimable.filter((c) => c.txID === action.input.txID).length ===
          1
        ),
        "There must be 1 claimable with this tx id."
      )
    )
    .chain(
      ce(
        state.claimable.filter((c) => c.txID === action.input.txID)[0]?.to !==
          action.caller,
        "Claim not addressed to caller."
      )
    )
    .chain(
      ce(
        !(
          action.input?.qty ===
          state.claimable.filter((c) => c.txID === action.input.txID)[0]?.qty
        ),
        "Incorrect qty."
      )
    )
    .fold(
      (msg) => {
        throw new ContractError(msg || "An error occurred.");
      },
      ({ state, action }) => {
        const { balances, claimable, claims } = state;
        const { input, caller } = action;
        const { txID } = input;
        if (!Number.isInteger(balances[caller])) balances[caller] = 0;
        const claim = claimable.filter((c) => c.txID === txID)[0];
        balances[caller] += claim.qty;
        claims.push(claim.txID);
        return {
          state: {
            ...state,
            claimable: claimable.filter((c) => c.txID !== claim.txID),
          },
        };
      }
    );
}
