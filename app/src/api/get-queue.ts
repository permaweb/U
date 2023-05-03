import Async from 'hyper-async';
import { viewState } from './common';
import { MintRequest } from './interface';
import { __, fromPairs, includes, reject, sort, toPairs } from 'ramda';
const { of, fromPromise } = Async;

/**
 * Returns the requests as pairs.
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {*}
 */
export function getQueue(tx: string, pile: string[]) {
  return of(tx)
    .chain((tx: string) =>
      fromPromise(viewState)(tx, { function: 'get-queue' })
    )
    .map(toPairs)
    .map(notInPile(pile, __ as unknown as any[]))
    .map(fromPairs)
    .fork(
      (e: any) => {
        console.log(e);
        return { error: 'There was an error fetching the contract state.' };
      },
      (requests: { [tx: string]: MintRequest }) =>
        sort(highest, toPairs(requests))
    );
}

/**
 * Returns the request with the highest expiration block.
 *
 * @author @jshaw-ar
 * @param {*} a
 * @param {*} b
 */
const highest = (a: any, b: any) => b[1].expires - a[1].expires;

/**
 * @description Returns pairs (requests) that haven't been processed
 *
 * @author @jshaw-ar
 * @export
 * @param {Object} state
 * @param {Array} pairs
 * @return {Array} pairs
 */
export const notInPile = (pile: string[], pairs: any[]) =>
  reject((pair) => includes((pair as string[])[0], pile), pairs);
