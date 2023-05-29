import Async from 'hyper-async';
import { getWarpFactory } from './common';
import { identity } from 'ramda';
import { waitForConfirmation } from './poll-mint';
const { of, fromPromise } = Async;

export function mint(contractId: string) {
  return of(contractId)
    .chain(fromPromise(warpMint))
    .map(setLocalStorage)
    .chain(waitForConfirmation)
    .fork((e: any) => {
      console.log(e);
      return { error: 'There was an error fetching the contract state' };
    }, identity);
}

const warpMint = async (tx: string) => {
  const warp = getWarpFactory();
  const contract = warp
    .contract(tx)
    .connect('use_wallet')
    .setEvaluationOptions({
      remoteStateSyncEnabled:
        import.meta.env.VITE_LOCAL === 'true' ? false : true,
      internalWrites: true,
      unsafeClient: 'skip',
      allowBigInt: true,
    });

  const interaction = await contract.writeInteraction({
    function: 'mint',
  });
  return interaction?.originalTxId;
};
export function setLocalStorage(tx: string) {
  localStorage.setItem('polling_tx', tx);
  return tx;
}
