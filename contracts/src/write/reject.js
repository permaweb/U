import Async from 'hyper-async';
const { of, fromPromise } = Async;
import { addClaimBalanceFrom, ceAsync } from '../util.js';

/**
 * Rejects a claim, and sends tokens back to the from value of the claim.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*}
 */
export function rejectClaimable({ kv }) {
  return (state, action) => {
    return of({ state, action })
      .chain(
        ceAsync(
          !action.input?.tx,
          'txID must be passed to the reject function.'
        )
      )
      .chain(
        ceAsync(
          state.claimable.filter((c) => c.txID === action.input.tx).length !==
            1,
          'There must be 1 claimable with this tx id.'
        )
      )
      .chain(
        ceAsync(
          state.claimable.filter((c) => c.txID === action.input.tx)[0]?.to !==
            action.caller,
          'Claim not addressed to caller.'
        )
      )
      .chain(({ state, action }) =>
        fromPromise(addClaimBalanceFrom)(state, action, kv)
      )
      .map((indexToRemove) => {
        state.claimable.splice(indexToRemove, 1);
        return state;
      })
      .fork(
        (msg) => {
          throw new ContractError(msg || 'An error occurred.');
        },
        (state) => ({ state })
      );
  };
}
