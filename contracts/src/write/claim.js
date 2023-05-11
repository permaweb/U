import Async from 'hyper-async';
const { of, fromPromise } = Async;
import { addClaimBalanceTo, ceAsync } from '../util.js';

/**
 * @description Claims rebAR from claimables
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} {state}
 */
export function claim({ kv }) {
  return (state, action) => {
    return of({ state, action })
      .chain(
        ceAsync(
          !action.input?.txID,
          'txID must be passed to the claim function.'
        )
      )
      .chain(ceAsync(!action.input?.qty, 'A qty must be specified.'))
      .chain(
        ceAsync(
          state.claimable.filter((c) => c.txID === action.input.txID).length !==
            1,
          'There must be 1 claimable with this tx id.'
        )
      )
      .chain(
        ceAsync(
          state.claimable.filter((c) => c.txID === action.input?.txID)[0]
            ?.to !== action.caller,
          'Claim not addressed to caller.'
        )
      )
      .chain(
        ceAsync(
          state.claimable.filter((c) => c.txID === action.input.txID)[0]
            ?.qty !== action.input?.qty,
          'Incorrect qty.'
        )
      )
      .chain(({ state, action }) =>
        fromPromise(addClaimBalanceTo)(state, action, kv)
      )
      .map((indexToRemove) => {
        state.claimable.splice(indexToRemove, 1);
        return state;
      })
      .fork(
        (msg) => {
          throw new ContractError(msg || 'An error occurred.');
        },
        () => {
          return { state };
        }
      );
  };
}
