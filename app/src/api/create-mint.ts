import Async from 'hyper-async';
import { getWarpFactory, syncState } from './common';
const { of, fromPromise } = Async;
import BigNumber from 'bignumber.js';

export function createMint(input: { contractId: string; qty: number }) {
  return of(input)
    .chain(fromPromise(createMintL1))
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

const createMintL1 = async (input: { contractId: string; qty: number }) => {
  const { contractId, qty } = input;
  const warp = getWarpFactory();
  if (!import.meta.env.VITE_LOCAL) await syncState(warp, contractId);
  const contract = warp
    .contract(contractId)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
    });
  return contract.writeInteraction(
    {
      function: 'create-mint',
    },
    {
      reward: new BigNumber(qty * 1e12)
        .integerValue(BigNumber.ROUND_DOWN)
        .toString(),
    }
  );
};