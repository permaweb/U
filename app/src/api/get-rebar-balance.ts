import Async from 'hyper-async';
import { viewState } from './common';
const { of, fromPromise } = Async;

/**
 * Returns the requests as pairs.
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {*}
 */
export function getRebarBalance(tx: string, target: string) {
  return of(tx)
    .chain((tx: string) =>
      fromPromise(viewState)(tx, { function: 'balance', target })
    )
    .fork(
      (e: any) => {
        throw new Error(e.message);
      },
      (result: any) => {
        return result.balance / 1e6;
      }
    );
}
