import { assoc, __, identity } from 'ramda';

import { of, fromNullable } from '../hyper-either.js';
import { ce } from '../util.js';

export function killContract(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ce(action.caller !== state.owner, 'Only owner.'))
    .map(({ state, action }) => ({
      ...state,
      killswitch: true,
    }))
    .map(assoc('state', __, {}))
    .fold((msg) => {
      throw new ContractError(msg || 'An error occurred.');
    }, identity);
}
