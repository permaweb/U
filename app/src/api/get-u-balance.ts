import Async from 'hyper-async';
import { viewState } from './common';
import { InteractionResult } from 'warp-contracts';
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
      fromPromise(viewStateWrapper)(tx, target, 'dre-1', undefined)
    )
    .chain((interaction: InteractionResult<unknown, unknown>) =>
      fromPromise(viewStateWrapper)(tx, target, 'dre-2', interaction)
    )
    .chain((interaction: InteractionResult<unknown, unknown>) =>
      fromPromise(viewStateWrapper)(tx, target, 'dre-3', interaction)
    )
    .chain((interaction: InteractionResult<unknown, unknown>) =>
      fromPromise(viewStateWrapper)(tx, target, 'dre-4', interaction)
    )
    .chain((interaction: InteractionResult<unknown, unknown>) =>
      fromPromise(viewStateWrapper)(tx, target, 'dre-5', interaction)
    )
    .chain((interaction: InteractionResult<unknown, unknown>) =>
      fromPromise(viewStateWrapper)(tx, target, 'dre-6', interaction)
    )
    .map((interaction: InteractionResult<unknown, unknown>) => {
      if (interaction.error) throw new Error('An error occurred.');
      return interaction;
    })
    .fork(
      (e: any) => {
        throw new Error(e?.message || e || 'An error occurred.');
      },
      (interaction: any) => interaction.result.balance / 1e6
    );
}

/**
 * Wraps viewState to check the interaction and reuse in pipe.
 *
 * @author @jshaw-ar
 * @param {string} tx
 * @param {string} target
 * @param {string} dre
 * @param {InteractionResult<unknown, unknown>} [interaction]
 * @return {*}  {(Promise<InteractionResult<unknown, unknown> | undefined>)}
 */
export const viewStateWrapper = async (
  tx: string,
  target: string,
  dre: string,
  interaction?: InteractionResult<unknown, unknown>
): Promise<InteractionResult<unknown, unknown> | undefined> => {
  if (interaction?.type === 'ok') return interaction;
  return viewState(tx, { function: 'balance', target }, dre);
};
