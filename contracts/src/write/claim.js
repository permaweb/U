import { fromNullable, of } from '../hyper-either.js';
import { addClaimBalanceTo, ce } from '../util.js';

/**
 * @description Claims U from claimables
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} {state}
 */
export function claim(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(
      ce(!action.input?.txID, 'txID must be passed to the claim function.')
    )
    .chain(ce(!action.input?.qty, 'A qty must be specified.'))
    .chain(
      ce(
        state.claimable.filter((c) => c.txID === action.input.txID).length !==
          1,
        'There must be 1 claimable with this tx id.'
      )
    )
    .chain(
      ce(
        state.claimable.filter((c) => c.txID === action.input?.txID)[0]?.to !==
          action.caller,
        'Claim not addressed to caller.'
      )
    )
    .chain(
      ce(
        state.claimable.filter((c) => c.txID === action.input.txID)[0]?.qty !==
          action.input?.qty,
        'Incorrect qty.'
      )
    )
    .map(addClaimBalanceTo)
    .map((indexToRemove) => {
      state.claimable.splice(indexToRemove, 1);
      return state;
    })
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      () => {
        return { state };
      }
    );
}
