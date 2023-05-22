import Async from 'hyper-async';
import { viewState } from './common';
import { MintRequest } from './interface';
import { sort } from 'ramda';
const { of, fromPromise } = Async;

/**
 * Returns the requests as pairs.
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {*}
 */
export function getQueue(tx: string) {
  return of(tx)
    .chain((tx: string) =>
      fromPromise(viewState)(tx, { function: 'get-queue' })
    )
    .fork(
      (e: any) => {
        console.log(e);
        throw new Error(e.message);
      },
      (requests: MintRequest[]) => sort(highest, requests)
    );
}

/**
 * Returns the request with the highest expiration block.
 *
 * @author @jshaw-ar
 * @param {*} a
 * @param {*} b
 */
const highest = (a: any, b: any) => b.expires - a.expires;
