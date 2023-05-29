import Async from 'hyper-async';
const { of, fromPromise } = Async;
import BigNumber from 'bignumber.js';
import { identity } from 'ramda';
import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import { setLocalStorage, waitForConfirmation } from './poll-mint';

/**
 * @author @jshaw-ar
 * @export
 * @param {{ contractId: string; qty: number }} input
 * @return {*}
 */
export function createMint(input: { contractId: string; qty: number }) {
  return of(input)
    .chain(fromPromise(createMintL1))
    .map(setLocalStorage)
    .chain(waitForConfirmation)
    .fork((e: any) => {
      return { error: 'There was an error fetching the contract state' };
    }, identity);
}

/**
 * @author @jshaw-ar
 * @param {{ contractId: string; qty: number }} input
 * @return {*}
 */
const createMintL1 = async (input: { contractId: string; qty: number }) => {
  const { contractId, qty } = input;
  const warp = WarpFactory.forMainnet(defaultCacheOptions, true);
  const interaction = await warp
    .contract(contractId)
    .connect('use_wallet')
    .setEvaluationOptions({
      remoteStateSyncEnabled: true,
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
      }
    );

  return interaction?.originalTxId;
};
