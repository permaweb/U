import { of, fromNullable } from '../hyper-either.js';

export function balance(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .fold(
      () => {
        throw new ContractError('An error occured.');
      },
      ({ state, action }) => {
        return {
          result: {
            target: action.input?.target || action.caller,
            ticker: state.ticker,
            balance: state.balances[action.input?.target || action.caller] || 0,
          },
        };
      }
    );
}
