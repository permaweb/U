import Async from 'hyper-async';
import { readState } from './common';
const { of, fromPromise } = Async;

/**
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {*}
 */
export function getState(tx: string) {
  return of(tx)
    .chain((tx: string) => fromPromise(readState)(tx))
    .map((input: any) => input)
    .fork(
      (e: any) => {
        return { error: 'There was an error fetching the contract state.' };
      },
      (state: any) => state
    );
}
