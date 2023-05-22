import Async from 'hyper-async';
import { getKV } from './common';
const { of, fromPromise } = Async;

/**
 * Returns the requests as pairs.
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {*}
 */
export function getRebarBalance(tx: string, address: string) {
  return of(tx)
    .chain((tx: string) => fromPromise(getKV)(tx, address))
    .fork(
      (e: any) => {
        console.log(e);
        throw new Error(e.message);
      },
      (balance: number) => (balance / 1e6).toFixed(2)
    );
}
