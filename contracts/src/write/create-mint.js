import { of } from '../hyper-either.js';
import { __, identity, assoc } from 'ramda';
import { roundDown } from '../util.js';

export function createMint({ block, transaction }) {
  return (state, action) => {
    return of({ state, action, block, transaction })
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
        qty: roundDown((transaction.reward || 0) / 1e6),
        expires: block.height + 720,
      },
      ...state.requests,
    },
  };
};
