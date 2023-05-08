import { of, fromNullable } from '../hyper-either.js';
import { ce, isInteger, roundDown } from '../util.js';

export function allow(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ce(!action.input?.target, 'Please specify a target.'))
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
        state.balances[action.caller] < action.input?.qty,
        'Not enough tokens for allow.'
      )
    )
    .map(({ state, action }) => {
      const safeQty = roundDown(action.input.qty);
      state.balances[action.caller] -= safeQty;
      state.claimable.push({
        from: action.caller,
        to: action.input.target,
        qty: safeQty,
        txID: SmartWeave.transaction.id,
      });
      return { state };
    })
    .fold(
      (msg) => {
        throw new ContractError(msg || 'An error occurred.');
      },
      (state) => state
    );
}
