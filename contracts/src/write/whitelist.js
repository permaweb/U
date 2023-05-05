import { assoc, __, identity, reject } from 'ramda';

import { of, fromNullable } from '../hyper-either.js';
import { ce } from '../util.js';

export function add(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ce(action.caller !== state.owner, 'Only owner.'))
    .chain(ce(action.input.addr === state.owner, 'Cannot add owner.'))
    .chain(ce(!action.input.addr, 'Please specify an address.'))
    .chain(
      ce(addingExisting(action.input.addr, state.whitelist), 'Already in list.')
    )
    .map(({ state, action }) => ({
      ...state,
      whitelist: [...state.whitelist, action.input.addr],
    }))
    .map(assoc('state', __, {}))
    .fold((msg) => {
      throw new ContractError(msg || 'An error occurred.');
    }, identity);
}

const addingExisting = (caller, whitelist) => whitelist.includes(caller);

export function remove(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ce(action.caller !== state.owner, 'Only owner.'))
    .chain(ce(!action.input?.addr, 'Please specify an address.'))
    .map(({ state, action }) => ({
      ...state,
      whitelist: [...reject((a) => a === action.input.addr, state.whitelist)],
    }))
    .map(assoc('state', __, {}))
    .fold((msg) => {
      throw new ContractError(msg || 'An error occurred.');
    }, identity);
}
