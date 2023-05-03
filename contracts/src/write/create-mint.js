import { of } from '../hyper-either.js';
import { __, identity, assoc } from 'ramda';
import { ce, roundDown } from '../util.js';

export function createMint({ block, transaction }) {
  return (state, action) => {
    return of({ state, action, block, transaction })
      .chain(
        ce(
          roundDown(SmartWeave.transaction.reward / 1e6) < 1000000,
          'You must mint at least 1 token.'
        )
      )
      .map(createRequest)
      .map(assoc('state', __, {}))
      .fold((msg) => {
        throw new ContractError(msg || 'An error occurred.');
      }, identity);
  };
}

const createRequest = ({ state, action, block, transaction }) => {
  return {
    ...state,
    requests: {
      [transaction.id]: {
        target: action.caller,
        qty: roundDown(transaction.reward / 1e6),
        expires: block.height + 720,
      },
      ...state.requests,
    },
  };
};
