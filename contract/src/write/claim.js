import { fromNullable, of } from "../hyper-either.js";
import { ce } from "../util.js";
import {
  always,
  assoc,
  __,
  compose,
  add,
  prop,
  find,
  reject,
  over,
  lensProp,
  ifElse,
  isNil,
  identity,
} from "ramda";
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
        state.claimable.filter((c) => c.txID === action.input.txID)[0]?.qty !==
          action.input?.qty,
        "Incorrect qty."
      )
    )
    .map(setCallerBalance)
    .map(handleClaim)
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
        ifElse(isNil, always(0), identity),
        state.balances
      ),
    },
    action,
  };
}

function handleClaim({ state, action }) {
  const txID = action.input.txID;
  const caller = action.caller;
  const byTx = (x) => x.txID === txID;

  return {
    ...state,
    balances: {
      ...state.balances,
      [caller]: compose(
        add(state.balances[caller]),
        prop("qty"),
        find(byTx),
        prop("claimable")
      )(state),
    },
    claimable: compose(reject(byTx), prop("claimable"))(state),
  };
}
