import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { WarpFactory, LoggerFactory, SourceType } from 'warp-contracts/mjs';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import * as fs from 'fs';
import BigNumber from 'bignumber.js';
import { compose, prop, fromPairs, toPairs, map } from 'ramda';

// Things that need to be used in multiple blocks
// for example, we start arlocal in the .before() and stop it in the .after()
let warp;
let wallet1;
let connectedWallet1SEQ;
let arlocal;

const test = suite('migration');

test.before(async () => {
  // arlocal = new ArLocal.default();
  // await arlocal.start();
  LoggerFactory.INST.logLevel('error');
  warp = WarpFactory.forLocal().use(new DeployPlugin());

  // Generate a wallet
  wallet1 = await warp.generateWallet();

  // Grab the contract and initial state
  const prefix = `./dist/`;
  const contractSrcSEQ = fs.readFileSync(`${prefix}contract-SEQ.js`, 'utf8');
  const initialStateSEQ = JSON.parse(
    fs.readFileSync(`${prefix}initial-state-SEQ.json`, 'utf8')
  );

  const stateSEQ = {
    ...initialStateSEQ,
    ...{
      owner: wallet1.address,
    },
  };

  // Deploy contract
  const contractSEQ = await warp.deploy({
    wallet: wallet1.jwk,
    initState: JSON.stringify({
      ...stateSEQ,
      // Set the mint contract to the L1 contract tx.
    }),
    src: contractSrcSEQ,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.WARP_SEQUENCER,
        internalWrites: true,
        unsafeClient: 'skip',
      },
    },
  });

  // Connect wallet to contract
  connectedWallet1SEQ = warp
    .contract(contractSEQ.contractTxId)
    .setEvaluationOptions({
      internalWrites: true,
      // unsafeClient: 'skip',
    })
    .connect(wallet1.jwk);
});

test('should throw unsafe client error', async () => {
  try {
    await connectedWallet1SEQ.writeInteraction({
      function: 'mint',
    });
    assert.unreachable('should have thrown');
  } catch (err) {
    assert.instance(err, Error);
    assert.match(
      err.message,
      'Option {unsafeClient} differs. EvaluationOptions: [throw], manifest: [skip]. Use contract.setEvaluationOptions({unsafeClient: skip}) to evaluate contract state.'
    );
  }
});

test.after(async () => {
  // await arlocal.stop();
});

test.run();
