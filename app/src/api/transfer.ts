import Async from 'hyper-async';
import { getWarpFactory } from './common';
const { of, fromPromise } = Async;
import BigNumber from 'bignumber.js';

import Arweave from 'arweave';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-deploy';
import { ArconnectSigner } from 'arbundles';

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