import { fromNullable, of } from '../hyper-either.js';
import { ce, isInteger, roundDown } from '../util.js';

/**
 * @description Creates a transfer that can be claimed.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} {state}
 */
export function allow(state, action) {
  return of(action.caller)
    .chain(fromNullable)
    .chain(ce(!action.input?.target, 'Please specify a target.'))
    .chain(
      ce(action.input?.target === action.caller, 'Target cannot be caller.')
    )

    .chain(ce(!isInteger(action.input?.qty), 'qty must be an integer.'))
    .chain(
      ce(
        roundDown(action.input?.qty) < 1,
        'Invalid token transfer. qty must be an integer greater than 0.'
      )
    )
    .chain(
      ce(
        (state.balances[action.caller] || 0) < roundDown(action.input?.qty),
        'Not enough tokens for transfer.'
      )
    )
    .map((caller) => {
      const safeQty = roundDown(action.input.qty);
      state.balances[caller] -= safeQty;
      state.claimable.push({
        from: caller,
        to: action.input.target,
        qty: safeQty,
        txID: SmartWeave.transaction.id,
      });
    })
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      () => ({ state })
    );
}
