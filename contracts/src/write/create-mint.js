import { of } from '../hyper-either.js';
import { ce, roundDown } from '../util.js';

/**
 * @description Creates an expiring request for the SEQUENCER contract to process (mint).
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} {state}
 */
export function createMint({ block, transaction }) {
  return (state, action) => {
    return of({ state, action, block, transaction })
      .chain(
        ce(
          roundDown(transaction.reward / state.divisibility) < 100,
          'You must mint at least 100 feron.'
        )
      )
      .map(({ state, action, block, transaction }) => {
        state.requests.push({
          tx: transaction.id,
          target: action.caller,
          qty: roundDown(transaction.reward / state.divisibility),
          expires: block.height + 720,
        });
        return state;
      })
      .fold(
        (msg) => {
          throw new ContractError(msg || 'An error occurred.');
        },
        (state) => ({ state })
      );
  };
}
