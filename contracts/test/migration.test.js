// import { suite } from 'uvu';
// import * as assert from 'uvu/assert';
// import { WarpFactory, LoggerFactory, SourceType } from 'warp-contracts/mjs';
// import { DeployPlugin } from 'warp-contracts-plugin-deploy';
// import * as fs from 'fs';
// import BigNumber from 'bignumber.js';
// import { compose, prop, fromPairs, toPairs, map } from 'ramda';

// // Things that need to be used in multiple blocks
// // for example, we start arlocal in the .before() and stop it in the .after()
// let warp;
// let wallet1;
// let connectedWallet1SEQ;
// let arlocal;
// let initialBalances;

// function getBalances(state) {
//   return compose(
//     fromPairs,
//     map(([k, v]) => [
//       k,
//       new BigNumber(v).integerValue(BigNumber.ROUND_DOWN).toNumber(),
//     ]),
//     toPairs,
//     prop('balances')
//   )(state);
// }

// const test = suite('migration');

// test.before(async () => {
//   // arlocal = new ArLocal.default();
//   // await arlocal.start();
//   LoggerFactory.INST.logLevel('error');
//   warp = WarpFactory.forLocal().use(new DeployPlugin());

//   // Generate a wallet
//   wallet1 = await warp.generateWallet();

//   // Grab the contract and initial state
//   const prefix = `./dist/`;
//   const contractSrcSEQ = fs.readFileSync(`${prefix}contract-SEQ.js`, 'utf8');
//   const initialStateSEQ = JSON.parse(
//     fs.readFileSync(`${prefix}initial-state-SEQ.json`, 'utf8')
//   );

//   const BAR = 'VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA';
//   const DRE = 'https://cache-2.permaweb.tools';

//   const BAR_STATE = await fetch(`${DRE}/contract/?id=${BAR}`)
//     .then((r) => r.json())
//     .then(prop('state'));
//   const balances = getBalances(BAR_STATE);
//   initialBalances = balances;
//   const stateSEQ = {
//     ...initialStateSEQ,
//     ...{
//       owner: wallet1.address,
//     },
//   };

//   // Deploy contract
//   const contractSEQ = await warp.deploy({
//     wallet: wallet1.jwk,
//     initState: JSON.stringify({
//       ...stateSEQ,
//       // Set the mint contract to the L1 contract tx.
//     }),
//     src: contractSrcSEQ,
//     evaluationManifest: {
//       evaluationOptions: {
//         sourceType: SourceType.WARP_SEQUENCER,
//         internalWrites: true,
//         unsafeClient: 'skip',
//
//       },
//     },
//   });

//   // Connect wallet to contract
//   connectedWallet1SEQ = warp
//     .contract(contractSEQ.contractTxId)
//     .setEvaluationOptions({
//       internalWrites: true,
//       unsafeClient: 'skip',
//
//     })
//     .connect(wallet1.jwk);
// });

// test('Should migrate balances to kv storage.', async () => {
//   await connectedWallet1SEQ.writeInteraction({
//     function: 'initialize',
//     initialBalances,
//   });
//   const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
//   const pairs = toPairs(state.balances);
//   const pile = toPairs(state.pile);
//   const balance = (
//     await connectedWallet1SEQ.getStorageValues([
//       '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
//     ])
//   ).cachedValue.get('9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4');
//   assert.is(state.initialized, true);
//   assert.is(balance > 0, true);
//   assert.is(pairs.length, 0);
//   assert.is(pile.length, 0);
// });

// test.after(async () => {
//   // await arlocal.stop();
// });

// test.run();
