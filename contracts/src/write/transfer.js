import { fromNullable, of } from '../hyper-either.js';
import { ce, isInteger, roundDown } from '../util.js';

/**
 * @description Transfers RebAR tokens to another address.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} state
 */
export function transfer(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ce(!action?.input?.target, 'Please specify a target.'))
    .chain(
      ce(action.input?.target === action.caller, 'Target cannot be caller.')
    )
    .chain(
      ce(
        !isInteger(state.balances[action.caller]),
        'Caller does not have a balance.'
      )
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
        state.balances[action.caller] < roundDown(action.input?.qty),
        'Not enough tokens for transfer.'
      )
    )
    .map(({ state, action }) => {
      const safeQty = roundDown(action.input.qty);
      const targetBalance = state.balances[action.input.target] || 0;
      state.balances[action.input.target] = targetBalance + safeQty;
      state.balances[action.caller] -= safeQty;
      return { state };
    })
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      (state) => state
    );
}
