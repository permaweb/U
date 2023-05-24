import Async from 'hyper-async';
import { getWarpFactory, syncState } from './common';
const { of, fromPromise } = Async;

export interface ClaimInput {
  contractId: string;
  tx: string;
  qty: number;
}

export function claim(input: ClaimInput) {
  return of(input)
    .chain((input: ClaimInput) => fromPromise(warpClaim)(input))
    .toPromise();
}

const warpClaim = async (input: ClaimInput) => {
  const { contractId, qty, tx } = input;
  const warp = getWarpFactory();

  if (!import.meta.env.VITE_LOCAL)
    await syncState(warp, contractId, 'https://dre-1.warp.cc');
  const contract = warp
    .contract(contractId)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
      allowBigInt: true,
    });

  const interaction = await contract.writeInteraction({
    function: 'claim',
    txID: tx,
    qty,
  });

  if (interaction?.originalTxId) {
    return interaction;
  }
};
