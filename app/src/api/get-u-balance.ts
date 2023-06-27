import Async, { Resolved } from 'hyper-async';
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
export function getUBalance(tx: string, target: string) {
  return of(tx)
    .chain((tx: string) =>
      fromPromise(viewState)(tx, { function: 'balance', target }, 'dre-3')
    )
    .bichain(
      () =>
        fromPromise(viewState)(tx, { function: 'balance', target }, 'dre-5'),
      Resolved
    )
    .bichain(
      () =>
        fromPromise(viewState)(tx, { function: 'balance', target }, 'dre-6'),
      Resolved
    )
    .bichain(
      () =>
        fromPromise(viewState)(tx, { function: 'balance', target }, 'dre-1'),
      Resolved
    )
    .bichain(
      () =>
        fromPromise(viewState)(tx, { function: 'balance', target }, 'dre-2'),
      Resolved
    )
    .bichain(
      () =>
        fromPromise(viewState)(tx, { function: 'balance', target }, 'dre-4'),
      Resolved
    )
    .fork(
      (e: any) => {
        throw new Error(e?.message || e || 'An error occurred.');
      },
      (interaction: any) => interaction.result.balance / 1e6
    );
}
