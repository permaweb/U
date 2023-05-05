import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { WarpFactory, LoggerFactory } from 'warp-contracts/mjs';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import ArLocal from 'arlocal';
import * as fs from 'fs';
import { toPairs } from 'ramda';

// Things that need to be used in multiple blocks
// for example, we start arlocal in the .before() and stop it in the .after()
let warp;
let wallet1;
let connectedWallet1L1;
let connectedWallet1SEQ;
let wallet2;
let connectedWallet2L1;
let connectedWallet2SEQ;
let arlocal;
// This will be set after allow, and be used for claiming
let allowTxForClaim1;
let allowTxForClaim2;
// To add to whitelist
let contractSEQTx;

const test = suite('full-integration');

test.before(async () => {
  // arlocal = new ArLocal.default();
  // await arlocal.start();
  LoggerFactory.INST.logLevel('error');
  warp = WarpFactory.forLocal().use(new DeployPlugin());

  // Generate a wallet
  wallet1 = await warp.generateWallet();
  wallet2 = await warp.generateWallet();

  // Grab the contract and initial state
  const prefix = `./dist/`;
  const contractSrcL1 = fs.readFileSync(`${prefix}contract-L1.js`, 'utf8');
  const initialStateL1 = JSON.parse(
    fs.readFileSync(`${prefix}initial-state-L1.json`, 'utf8')
  );
  const contractSrcSEQ = fs.readFileSync(`${prefix}contract-SEQ.js`, 'utf8');
  const initialStateSEQ = JSON.parse(
    fs.readFileSync(`${prefix}initial-state-SEQ.json`, 'utf8')
  );

  // Update initial state giving the wallet 100
  const stateL1 = {
    ...initialStateL1,
    ...{
      owner: wallet1.address,
      whitelist: [wallet1.address, wallet2.address],
      requests: {
        '<expired>': {
          target: '<jshaw>',
          qty: 100,
          expires: 0,
        },
      },
    },
  };

  const stateSEQ = {
    ...initialStateSEQ,
    ...{
      owner: wallet1.address,
      whitelist: [wallet1.address, wallet2.address],
    },
  };

  // Deploy contract
  const contractL1 = await warp.deploy({
    wallet: wallet1.jwk,
    initState: JSON.stringify(stateL1),
    src: contractSrcL1,
  });

  // Deploy contract
  const contractSEQ = await warp.deploy({
    wallet: wallet1.jwk,
    initState: JSON.stringify({
      ...stateSEQ,
      // Set the mint contract to the L1 contract tx.
      mint_contract: contractL1.contractTxId,
    }),
    src: contractSrcSEQ,
  });

  // SET THIS FOR THE ADD TO WHITE LIST
  contractSEQTx = contractSEQ.contractTxId;

  // Connect wallet to contract
  connectedWallet1L1 = warp
    .contract(contractL1.contractTxId)
    .setEvaluationOptions({ internalWrites: true, mineArLocalBlocks: true })
    .connect(wallet1.jwk);
  connectedWallet1SEQ = warp
    .contract(contractSEQ.contractTxId)
    .setEvaluationOptions({ internalWrites: true, mineArLocalBlocks: true })
    .connect(wallet1.jwk);

  connectedWallet2L1 = warp
    .contract(contractL1.contractTxId)
    .setEvaluationOptions({ internalWrites: true, mineArLocalBlocks: true })
    .connect(wallet2.jwk);

  connectedWallet2SEQ = warp
    .contract(contractSEQ.contractTxId)
    .setEvaluationOptions({ internalWrites: true, mineArLocalBlocks: true })
    .connect(wallet2.jwk);

  // Mint AR to wallet1
  await fetch(
    // Mints 300 AR.
    `http://localhost:1984/mint/${wallet1.address}/100000000000000`
  );
});

test('should create mint request for 10 RebAR with wallet1', async () => {
  await connectedWallet1L1.writeInteraction(
    { function: 'create-mint' },
    { reward: '10000000000000' }
  );
  const state = (await connectedWallet1L1.readState()).cachedValue.state;
  assert.is(toPairs(state.requests)[0][1]?.qty, 10000000);
});

test('should add SEQ contract to white list', async () => {
  await connectedWallet1L1.writeInteraction(
    {
      function: 'add',
      addr: contractSEQTx,
    },
    { reward: '1' }
  );
  const state = (await connectedWallet1L1.readState()).cachedValue.state;
  assert.is(state.whitelist.includes(contractSEQTx), true);
});

test('should mint 10 RebAR', async () => {
  await connectedWallet1SEQ.writeInteraction({ function: 'mint' });
  const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
  assert.is(state.balances[wallet1.address], 10000000);
});

test('transfer 5 to wallet 2', async () => {
  await connectedWallet1SEQ.writeInteraction({
    function: 'transfer',
    target: wallet2.address,
    qty: 5000000,
  });
  const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
  assert.is(state.balances[wallet2.address], 5000000);
});

test('allow 2 with wallet 2 (to wallet 1) - allow 1 with wallet 2', async () => {
  const interaction1 = await connectedWallet2SEQ.writeInteraction({
    function: 'allow',
    target: wallet1.address,
    qty: 2000000,
  });

  const interaction2 = await connectedWallet2SEQ.writeInteraction({
    function: 'allow',
    target: wallet1.address,
    qty: 1000000,
  });

  const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
  assert.is(state.claimable.length, 2);

  // Set the allow tx for claim next
  allowTxForClaim1 = interaction1.originalTxId;
  allowTxForClaim2 = interaction2.originalTxId;
});

test('claim 2 with wallet 1', async () => {
  await connectedWallet1SEQ.writeInteraction({
    function: 'claim',
    txID: allowTxForClaim1,
    qty: 2000000,
  });
  const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
  assert.is(state.balances[wallet1.address], 7000000);
  assert.is(state.balances[wallet2.address], 2000000);
});

test('should claim with different txID', async () => {
  await connectedWallet1SEQ.writeInteraction({
    function: 'claim',
    txID: allowTxForClaim2,
    qty: 1000000,
  });
  const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
  assert.is(state.balances[wallet1.address], 8000000);
  assert.is(state.balances[wallet2.address], 2000000);
});

test('check balance with target', async () => {
  const balanceFunc = await connectedWallet1SEQ.viewState({
    function: 'balance',
    target: wallet2.address,
  });
  assert.is(balanceFunc.result.balance, 2000000);
});

test('check balance without target', async () => {
  const balanceFunc = await connectedWallet1SEQ.viewState({
    function: 'balance',
  });
  assert.is(balanceFunc.result.balance, 8000000);
});

test('should kill L1 contract', async () => {
  await connectedWallet1L1.writeInteraction(
    {
      function: 'kill',
    },
    { reward: '1' }
  );
  const state = (await connectedWallet1L1.readState()).cachedValue.state;
  assert.is(state.killswitch, true);
});

test('should kill SEQ contract', async () => {
  await connectedWallet1SEQ.writeInteraction({
    function: 'kill',
  });
  const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
  assert.is(state.killswitch, true);
});

test.after(async () => {
  // await arlocal.stop();
});

test.run();
