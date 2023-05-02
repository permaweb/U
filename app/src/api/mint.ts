import Async from 'hyper-async';
import { getWarpFactory, syncState } from './common';
const { of, fromPromise } = Async;

export function mint(contractId: string) {
  return of(contractId)
    .chain(fromPromise(warpMint))
    .fork(
      (e: any) => {
        console.log(e);
        return { error: 'There was an error fetching the contract state' };
      },
      (res: any) => {
        console.log('res', res);
        return res;
      }
    );
}

const warpMint = async (tx: string) => {
  const warp = getWarpFactory();
  if (!import.meta.env.VITE_LOCAL) await syncState(warp, tx);
  const contract = warp
    .contract(tx)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
    });
  return contract.writeInteraction({
    function: 'mint',
  });
};
