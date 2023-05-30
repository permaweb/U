import Async from 'hyper-async';
import { getWarpFactory } from './common';
const { of, fromPromise } = Async;
import BigNumber from 'bignumber.js';

export interface TransferInput {
  contractId: string;
  from: string;
  target: string;
  qty: number;
}

export function transfer(input: TransferInput) {
  return of(input)
    .chain((input: TransferInput) => fromPromise(warpTransfer)(input))
    .toPromise();
}

const warpTransfer = async (input: TransferInput) => {
  const { contractId, qty, target, from } = input;
  const warp = getWarpFactory();

  const contract = warp
    .contract(contractId)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
      remoteStateSyncEnabled:
        import.meta.env.VITE_LOCAL === 'true' ? false : true,
      allowBigInt: true,
    });
  const newQty = new BigNumber(qty * 1e6)
    .integerValue(BigNumber.ROUND_DOWN)
    .toNumber();

  const interaction = await contract.writeInteraction({
    function: 'transfer',
    target,
    qty: newQty,
  });

  if (interaction?.originalTxId) {
    return interaction;
  }
};
