import { WarpFactory } from 'warp-contracts';

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
 * @param {string} tx
 * @return {*}
 */
export const readState = async (tx: string) => {
  const warp = getWarpFactory();
  const contract = await warp
    .contract(tx)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
      remoteStateSyncSource: 'https://dre-6.warp.cc/contract',
      remoteStateSyncEnabled:
        import.meta.env.VITE_LOCAL === 'true' ? false : true,
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
  const state = await warp
    .contract(tx)
    .setEvaluationOptions({
      remoteStateSyncSource: 'https://dre-6.warp.cc/contract',
      remoteStateSyncEnabled:
        import.meta.env.VITE_LOCAL === 'true' ? false : true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .viewState(input);
  if (state.error) throw new Error(state.errorMessage || 'An error occurred.');
  return state.result;
};
