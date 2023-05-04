import { Warp, WarpFactory } from 'warp-contracts';

/**
 *
 * @author @jshaw-ar
 * @export
 * @return {Warp}
 */
export function getWarpFactory() {
  return import.meta.env.VITE_LOCAL === 'true'
    ? WarpFactory.forLocal()
    : WarpFactory.forMainnet();
}

/**
 *
 * @author @jshaw-ar
 * @export
 * @param {Warp} warp
 * @param {string} contractId
 * @return {Warp}
 */
export async function syncState(warp: Warp, contractId: string) {
  const CACHE = 'https://cache.permapages.app';
  await warp
    .contract(contractId)
    .syncState(CACHE + '/contract', { validity: true });
}

/**
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {*}
 */
export const readState = async (tx: string) => {
  const warp = getWarpFactory();
  if (!import.meta.env.VITE_LOCAL) await syncState(warp, tx);
  const contract = await warp
    .contract(tx)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
    })
    .readState();
  return contract.cachedValue.state;
};

/**
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @param {any} input
 * @return {*}
 */
export const viewState = async (tx: string, input: any) => {
  const warp = getWarpFactory();
  if (!import.meta.env.VITE_LOCAL) await syncState(warp, tx);
  const state = await warp
    .contract(tx)
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
    })
    .viewState(input);
  if (state.error) throw new Error(state.errorMessage || 'An error occurred.');
  return state.result;
};
