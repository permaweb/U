import Async from 'hyper-async';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-deploy';
import { getWarpFactory } from './common';
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
  
  const signer: any = new InjectedArweaveSigner(global.window.arweaveWallet);
  signer.getAddress = global.window.arweaveWallet.getActiveAddress;
  await signer.setPublicKey();

  const contract = warp
    .contract(contractId)
    .connect(signer)
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
      remoteStateSyncSource: 'https://dre-u.warp.cc/contract',
      remoteStateSyncEnabled:
        true,
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
