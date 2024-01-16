import Async from 'hyper-async';
const { of, fromPromise } = Async;
import BigNumber from 'bignumber.js';
import { identity } from 'ramda';
import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-deploy';
import { DRES } from './constants';

/**
 * @author @jshaw-ar
 * @export
 * @param {{ contractId: string; qty: number }} input
 * @return {*}
 */
export function burn(input: { contractId: string; qty: number }) {
  return of(input)
    .chain(fromPromise(mint))
    .map(setLocalStorage)
    .fork((e: any) => {
      return { error: 'There was an error fetching the contract state' };
    }, identity);
}

/**
 * @author @jshaw-ar
 * @param {{ contractId: string; qty: number }} input
 * @return {*}
 */
const mint = async (input: { contractId: string; qty: number }) => {
  const { contractId, qty } = input;

  const warp = WarpFactory.forMainnet(defaultCacheOptions, true);

  const signer: any = new InjectedArweaveSigner(global.window.arweaveWallet);
  signer.getAddress = global.window.arweaveWallet.getActiveAddress;
  await signer.setPublicKey();

  const interaction = await warp
    .contract(contractId)
    .connect(signer)
    .setEvaluationOptions({
      remoteStateSyncSource: DRES['DRE-U'],
      remoteStateSyncEnabled:
        true,
      unsafeClient: 'skip',
      allowBigInt: true,
      internalWrites: true,
    })
    .writeInteraction(
      {
        function: 'mint',
      },
      {
        disableBundling: true,
        reward: new BigNumber(qty * 1e12)
          .integerValue(BigNumber.ROUND_DOWN)
          .toString(),
      },
    );
  return interaction?.originalTxId;
};

export function setLocalStorage(tx: string) {
  localStorage.setItem('polling_tx', tx);
  return tx;
}
