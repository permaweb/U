import { LoggerFactory, defaultCacheOptions, WarpFactory } from 'warp-contracts';
import { DeployPlugin, InjectedArweaveSigner } from 'warp-contracts-plugin-deploy';
import { DRES } from './constants';

LoggerFactory.INST.logLevel('fatal');

/**
 *
 * @author @jshaw-ar
 * @export
 * @return {Warp}
 */
export function getWarpFactory() {
  return WarpFactory.forMainnet({
    ...defaultCacheOptions,
    inMemory: true,
  }).use(new DeployPlugin());
}

/**
 *
 * @author @jshaw-ar
 * @export
 * @todo turn this into an async pipe so it's easier to read
 * @param {string} tx
 * @return {*}
 */
export const readState = async (tx: string) => {
  const warp = getWarpFactory();
  
  const signer: any = new InjectedArweaveSigner(global.window.arweaveWallet);
  signer.getAddress = global.window.arweaveWallet.getActiveAddress;
  await signer.setPublicKey();

  return warp
    .contract(tx)
    .connect(signer)
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
      remoteStateSyncSource: DRES['DRE-U'],
      remoteStateSyncEnabled:
        true,
      allowBigInt: true,
    })
    .readState()
    .then((s) => s.cachedValue.state);
};

/**
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @param {any} input
 * @param {string} dre
 * @return {*}
 */
export const viewState = async (tx: string, input: any, dre: string) => {
  const warp = getWarpFactory();
  const interaction = warp
    .contract(tx)
    .setEvaluationOptions({
      remoteStateSyncSource: dre,
      remoteStateSyncEnabled:
        true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .viewState(input);
  if ((await interaction).type === 'ok') return interaction;
  throw new Error(`There was an error evaluating state using ${dre}.`);
};
