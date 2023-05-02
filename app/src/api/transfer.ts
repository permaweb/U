import Async from 'hyper-async';
import { getWarpFactory, syncState } from './common';
const { of, fromPromise } = Async;
import BigNumber from 'bignumber.js';

export function transfer(input: {
  contractId: string;
  qty: number;
  target: string;
}) {
  return of(input)
    .chain((input: { contractId: string; qty: number; target: string }) =>
      fromPromise(warpTransfer)(input)
    )
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

const warpTransfer = async (input: {
  contractId: string;
  qty: number;
  target: string;
}) => {
  const { contractId, qty, target } = input;
  const warp = getWarpFactory();
  if (!import.meta.env.VITE_LOCAL) await syncState(warp, contractId);
  const contract = warp
    .contract(contractId)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
    });
  return contract.writeInteraction({
    function: 'transfer',
    target,
    qty: new BigNumber(qty * 1e6).integerValue(BigNumber.ROUND_DOWN).toNumber(),
  });
};
