import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { WarpFactory, LoggerFactory } from 'warp-contracts/mjs';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
// import ArLocal from 'arlocal';
import * as fs from 'fs';

// Things that need to be used in multiple blocks
// for example, we start arlocal in the .before() and stop it in the .after()
let warp;
let wallet1;
let connectedWallet1;
let arlocal;

const test = suite('handle-L1');

test.before(async () => {
  // arlocal = new ArLocal.default();
  // await arlocal.start();
  LoggerFactory.INST.logLevel('error');
  warp = WarpFactory.forLocal().use(new DeployPlugin());

  // Generate a wallet
  wallet1 = await warp.generateWallet();

  // Grab the contract and initial state
  const prefix = `./dist/`;
  const contractSrc = fs.readFileSync(`${prefix}contract-L1.js`, 'utf8');
  const state = JSON.parse(
    fs.readFileSync(`${prefix}initial-state-L1.json`, 'utf8')
  );

  // Update initial state giving the wallet 100
  const initialState = {
    ...state,
    ...{
      owner: wallet1.address,
      whitelist: [...state.whitelist, wallet1.address],
      requests: {
        zero_qty: {
          target: '<jshaw>',
          qty: 0,
          expires: 722,
        },
        expired: {
          expires: 0,
        },
        'not-expired': {
          expires: 2,
          qty: 5,
          target: '<jshaw>',
        },
      },
    },
  };

  // Deploy contract
  const { contractTxId } = await warp.deploy(
    {
      wallet: wallet1.jwk,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    },
    true
  );

  // Connect wallet to contract
  connectedWallet1 = warp
    .contract(contractTxId)
    .setEvaluationOptions({ internalWrites: true, mineArLocalBlocks: true })
    .connect(wallet1.jwk);

  // // Mint AR to wallet1
  await fetch(
    // Mints 300 AR.
    `http://localhost:1984/mint/${wallet1.address}/100000000000000`
  );

  // MINE BLOCK
  await fetch(`http://localhost:1984/mine`);
});

test('should filter out expired requests and create a request for 10000000', async () => {
  // See initialState for how the requests
  // are preloaded into the state of the contract
  const interaction = await connectedWallet1.writeInteraction(
    { function: 'create-mint' },
    { reward: '10000000000000' }
  );
  const state = (await connectedWallet1.readState()).cachedValue.state;
  console.log('REQUESTS', state.requests);
  assert.is(state.requests['expired'], undefined);
  assert.is(state.requests['zero_qty'], undefined);
  assert.is(state.requests[interaction.originalTxId].qty, 10000000);
});

test('Should create requests for 0 if no reward is added.', async () => {
  const interaction = await connectedWallet1.writeInteraction({
    function: 'create-mint',
  });
  const state = (await connectedWallet1.readState()).cachedValue.state;
  assert.is(state.requests[interaction.originalTxId]?.qty, 0);
});

test('Should create requests for 0 if reward is undefined.', async () => {
  const interaction = await connectedWallet1.writeInteraction(
    {
      function: 'create-mint',
    },
    { reward: undefined }
  );
  const state = (await connectedWallet1.readState()).cachedValue.state;
  assert.is(state.requests[interaction.originalTxId]?.qty, 0);
});

test('Should create requests for 0 if reward is null', async () => {
  const interaction = await connectedWallet1.writeInteraction(
    {
      function: 'create-mint',
    },
    { reward: null }
  );
  const state = (await connectedWallet1.readState()).cachedValue.state;
  assert.is(state.requests[interaction.originalTxId]?.qty, 0);
});

test('should create a request for 0 if reward is string xxx.', async () => {
  const interaction = await connectedWallet1.writeInteraction(
    {
      function: 'create-mint',
    },
    { reward: 'xxx' }
  );
  // Just check that the interaction is null as the error is thrown
  // inside of the warp environment and we cant assert the function
  // will throw (i dont think)
  assert.is(interaction, null);
});

test.after(async () => {
  // await arlocal.stop();
});

test.run();
