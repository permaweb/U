import { fromNullable, of } from '../hyper-either.js';
import { ce } from '../util.js';

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
    .map(({ state, action }) => {
      // find the index to remove
      const indexToRemove = state.claimable.findIndex(
        (claim) => claim.txID === action.input.txID
      );
      // select the claim
      const claim = state.claimable[indexToRemove];
      // set balance to previous balance or zero
      const balance = state.balances[action.caller] || 0;
      // update caller balance
      state.balances[action.caller] = balance + claim.qty;
      // remove claim
      state.claimable.splice(indexToRemove, 1);
      return { state };
    })
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      (state) => state
    );
}
