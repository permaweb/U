import Async from 'hyper-async';
import { viewState } from './common';
import { DRES } from './constants';
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
      fromPromise(viewState)(
        tx,
        { function: 'balance', target },
        DRES['DRE-U'],
      ),
    )
    .fork(
      (e: any) => {
        throw new Error(e?.message || e || 'An error occurred.');
      },
      (interaction: any) => interaction.result.balance / 1e6,
    );
}
