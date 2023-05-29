import Async from 'hyper-async';
import { getWarpFactory, syncState } from './common';
import { identity } from 'ramda';
const { of, fromPromise } = Async;

export function mint(contractId: string) {
  return of(contractId)
    .chain(fromPromise(warpMint))
    .fork((e: any) => {
      console.log(e);
      return { error: 'There was an error fetching the contract state' };
    }, identity);
}

const warpMint = async (tx: string) => {
  const warp = getWarpFactory();
  //if (!import.meta.env.VITE_LOCAL) await syncState(warp, tx);
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
  return interaction;
};
