// import { suite } from 'uvu';
// import * as assert from 'uvu/assert';
// import { mint } from '../src/write/mint.js';
// import { setupSmartWeaveEnv } from './setup.js';
// const test = suite('mint');

// test.before(async () => {});

// test('should mint 1 rebar', async () => {
//   const env = setupSmartWeaveEnv(
//     1000000000000, // reward
//     0, // height
//     '<tx>'
//   );

//   const caller = '<justin>';
//   const output = mint(
//     {
//       name: 'RebAR',
//       ticker: 'RebAR',
//       balances: {},
//       settings: [
//         ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//         ['isTradeable', true],
//       ],
//       claimable: [],
//       divisibility: 1e6,
//     },
//     { caller }
//   );
//   const state = output.state;
//   assert.is(state.balances[caller], 1000000);
// });

// test('should throw You must mint at least 100 feron.', () => {
//   const caller = '<justin>';

//   const env = setupSmartWeaveEnv(
//     999999, // reward
//     0, // height
//     '<tx>'
//   );
//   const output = mint(
//     {
//       name: 'RebAR',
//       ticker: 'RebAR',
//       balances: {},
//       settings: [
//         ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
//         ['isTradeable', true],
//       ],
//       claimable: [],
//       divisibility: 1e6,
//     },
//     { caller }
//   );

//   const state = output.state;
//   assert.is(state.balances[caller], undefined);
// });
// test.after(async () => {});

// test.run();
