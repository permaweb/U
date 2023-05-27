import Async from 'hyper-async';
const { of, fromPromise } = Async;
import BigNumber from 'bignumber.js';
import { identity } from 'ramda';
import { WarpFactory, defaultCacheOptions } from 'warp-contracts';

/**
 * @author @jshaw-ar
 * @export
 * @param {{ contractId: string; qty: number }} input
 * @return {*}
 */
export function createMint(input: { contractId: string; qty: number }) {
  return of(input)
    .chain(fromPromise(createMintL1))
    .fork((e: any) => {
      return { error: 'There was an error fetching the contract state' };
    }, identity);
}

/**
 * @author @jshaw-ar
 * @param {{ contractId: string; qty: number }} input
 * @return {*}
 */
const createMintL1 = async (input: { contractId: string; qty: number }) => {
  const { contractId, qty } = input;
  //const warp = getWarpFactory();
  //if (!import.meta.env.VITE_LOCAL) await syncState(warp, contractId);
  const warp = WarpFactory.forMainnet(defaultCacheOptions, true);
  return warp
    .contract(contractId)
    .connect('use_wallet')
    .setEvaluationOptions({
      remoteStateSyncEnabled: true,
      unsafeClient: 'skip',
      allowBigInt: true,
      internalWrites: true,
    })
    .writeInteraction(
      {
        function: 'create-mint',
      },
      {
        disableBundling: true,
        reward: new BigNumber(qty * 1e12)
          .integerValue(BigNumber.ROUND_DOWN)
          .toString(),
      }
    );
};

// import Async from 'hyper-async';
// const { of, fromPromise } = Async;
// import { getArweave, getWarpFactory } from './common';
// import BigNumber from 'bignumber.js';
// import { identity } from 'ramda';
// import { WarpFactory, defaultCacheOptions } from 'warp-contracts';

// /**
//  * @author @jshaw-ar
//  * @export
//  * @param {{ contractId: string; qty: number }} input
//  * @return {*}
//  */
// export function createMint(input: { contractId: string; qty: number }) {
//   return of(input)
//     .chain(fromPromise(createMintL1))
//     .fork((e: any) => {
//       return { error: 'There was an error fetching the contract state' };
//     }, identity);
// }

// /**
//  * @author @jshaw-ar
//  * @param {{ contractId: string; qty: number }} input
//  * @return {*}
//  */
// const createMintL1 = async (input: { contractId: string; qty: number }) => {
//   const { contractId, qty } = input;

//   const arweave = getArweave();

//   await window?.arweaveWallet.connect([
//     'ACCESS_ADDRESS',
//     'SIGN_TRANSACTION',
//     'DISPATCH',
//     'ACCESS_PUBLIC_KEY',
//     'SIGNATURE',
//   ]);
//   const interaction = await arweave.createTransaction({
//     data: 'x',
//     reward: new BigNumber(qty * 1e12)
//       .integerValue(BigNumber.ROUND_DOWN)
//       .toString(),
//   });

//   interaction.addTag('App-Name', 'SmartWeaveAction');
//   interaction.addTag('App-Version', '0.3.0');
//   interaction.addTag('SDK', 'Warp');
//   interaction.addTag('Contract', contractId);
//   interaction.addTag('Input', '{"function":"create-mint"}');
//   await arweave.transactions.sign(interaction, 'use_wallet');
//   await arweave.transactions.post(interaction);
//   console.log('Interaction', interaction.id);
// };
