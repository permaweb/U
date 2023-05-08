import { fromNullable, of } from '../hyper-either.js';
import { ce } from '../util.js';

/**
 * Rejects a claim, and sends tokens back to the from value of the claim.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*}
 */
export function rejectClaimable(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ce(!action.input?.tx, 'txID must be passed to the reject function.'))
    .chain(
      ce(
        state.claimable.filter((c) => c.txID === action.input.tx).length !== 1,
        'There must be 1 claimable with this tx id.'
      )
    )
    .chain(
      ce(
        state.claimable.filter((c) => c.txID === action.input.tx)[0]?.to !==
          action.caller,
        'Claim not addressed to caller.'
      )
    )
    .map(({ state, action }) => {
      // find the index to remove
      const indexToRemove = state.claimable.findIndex(
        (claim) => claim.txID === action.input.tx
      );
      // select the claim
      const claim = state.claimable[indexToRemove];
      // set balance to previous balance or zero
      const balance = state.balances[claim.from] || 0;
      // update caller balance
      state.balances[claim.from] = balance + claim.qty;
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
