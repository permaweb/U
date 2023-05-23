import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { WarpFactory, LoggerFactory } from 'warp-contracts/mjs';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
// import ArLocal from 'arlocal';
import * as fs from 'fs';
import BigNumber from 'bignumber.js';

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

const test = suite('big-numbers');

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
      requests: [
        {
          tx: '<expired>',
          target: '<jshaw>',
          qty: 100,
          expires: 0,
        },
      ],
    },
  };

  const stateSEQ = {
    ...initialStateSEQ,
    ...{
      owner: wallet1.address,
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

  // Connect wallet to contract
  connectedWallet1L1 = warp
    .contract(contractL1.contractTxId)
    .setEvaluationOptions({
      internalWrites: true,
      mineArLocalBlocks: true,
    })
    .connect(wallet1.jwk);
  connectedWallet1SEQ = warp
    .contract(contractSEQ.contractTxId)
    .setEvaluationOptions({
      internalWrites: true,
      mineArLocalBlocks: true,
    })
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

test('should create-mint 1000 * 1e12', async () => {
  const interaction = await connectedWallet1L1.writeInteraction(
    { function: 'create-mint' },
    {
      reward: new BigNumber(1000 * 1e12)
        .integerValue(BigNumber.ROUND_DOWN)
        .toString(),
    }
  );
  const state = (await connectedWallet1L1.readState()).cachedValue.state;
  const request = state.requests.filter(
    (r) => r.tx === interaction.originalTxId
  )[0];
  assert.is(request?.qty, 1000000000);
});

test('should mint 1000 * 1e12', async () => {
  await connectedWallet1SEQ.writeInteraction({ function: 'mint' });
  const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
  assert.is(state.balances[wallet1.address], 1000000000);
});

test('should transfer 1000 * 1e6', async () => {
  const interaction = await connectedWallet1SEQ.writeInteraction({
    function: 'transfer',
    target: wallet2.address,
    qty: new BigNumber(1000 * 1e6)
      .integerValue(BigNumber.ROUND_DOWN)
      .toNumber(),
  });
  console.log('Iteraction', interaction);
  const state = (await connectedWallet1SEQ.readState()).cachedValue.state;
  assert.is(state.balances[wallet2.address], 1000000000);
});

test.after(async () => {
  // await arlocal.stop();
});

test.run();
