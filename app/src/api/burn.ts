import Async from 'hyper-async';
const { of, fromPromise } = Async;
import BigNumber from 'bignumber.js';
import { identity } from 'ramda';
import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import { waitForConfirmation } from './poll-mint';

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
const mint = async (input: { contractId: string; qty: number }) => {
  const { contractId, qty } = input;

  const warp =
    import.meta.env.VITE_LOCAL === 'true'
      ? WarpFactory.forLocal()
      : WarpFactory.forMainnet(defaultCacheOptions, true);
  const interaction = await warp
    .contract(contractId)
    .connect('use_wallet')
    .setEvaluationOptions({
      remoteStateSyncEnabled:
        import.meta.env.VITE_LOCAL === 'true' ? false : true,
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

export function setLocalStorage(tx: string) {
  localStorage.setItem('polling_tx', tx);
  return tx;
}
