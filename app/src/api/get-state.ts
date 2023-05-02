import Async from 'hyper-async';
import { getWarpFactory, syncState } from './common';
const { of, fromPromise } = Async;

export function getState(tx: string) {
  return of(tx)
    .chain((tx: string) => fromPromise(readState)(tx))
    .map((input: any) => input)
    .fork(
      (e: any) => {
        console.log(e);
        return { error: 'There was an error fetching the contract state.' };
      },
      (state: any) => {
        console.log('State', JSON.stringify(state));
        return state;
      }
    );
}

const readState = async (tx: string) => {
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
