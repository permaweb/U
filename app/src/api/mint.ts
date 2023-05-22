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
  if (!import.meta.env.VITE_LOCAL) await syncState(warp, tx);
  const contract = warp
    .contract(tx)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
      useKVStorage: true,
      useConstructor: true,
      allowBigInt: true,
    });
  return contract.writeInteraction({
    function: 'mint',
  });
};
