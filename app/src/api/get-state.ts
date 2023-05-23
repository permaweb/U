import Async from 'hyper-async';
import { readState } from './common';
import { readStateWithoutInternalWrites } from './common';
const { of, fromPromise } = Async;

/**
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {*}
 */
export function getStateInternalWrites(tx: string) {
  return of(tx)
    .chain((tx: string) => fromPromise(readState)(tx))
    .map((input: any) => input)
    .fork(
      (e: any) => {
        console.log(e);
        return { error: 'There was an error fetching the contract state.' };
      },
      (state: any) => state
    );
}

/**
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {*}
 */
export function getStateNoInternalWrites(tx: string) {
  return of(tx)
    .chain((tx: string) => fromPromise(readStateWithoutInternalWrites)(tx))
    .map((input: any) => input)
    .fork(
      (e: any) => {
        console.log(e);
        return { error: 'There was an error fetching the contract state.' };
      },
      (state: any) => state
    );
}
