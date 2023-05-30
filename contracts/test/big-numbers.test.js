import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { WarpFactory, LoggerFactory } from 'warp-contracts/mjs';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import * as fs from 'fs';
import BigNumber from 'bignumber.js';

// Things that need to be used in multiple blocks
// for example, we start arlocal in the .before() and stop it in the .after()
let warp;
let wallet1;
let connectedWallet;
let wallet2;
let conntectedWallet2;
let arlocal;

const test = suite('big-numbers');

test.before(async () => {
  LoggerFactory.INST.logLevel('error');
  warp = WarpFactory.forLocal().use(new DeployPlugin());

  // Generate a wallet
  wallet1 = await warp.generateWallet();
  wallet2 = await warp.generateWallet();

  // Grab the contract and initial state
  const prefix = `./dist/`;
  const contractSrc = fs.readFileSync(`${prefix}contract.js`, 'utf8');
  const stateFomFile = JSON.parse(
    fs.readFileSync(`${prefix}initial-state.json`, 'utf8')
  );

  const initialState = {
    ...stateFomFile,
    ...{
      owner: wallet1.address,
    },
  };

  // Deploy contract
  const contract = await warp.deploy({
    wallet: wallet1.jwk,
    initState: JSON.stringify({
      ...initialState,
    }),
    src: contractSrc,
  });

  connectedWallet = warp
    .contract(contract.contractTxId)
    .setEvaluationOptions({
      internalWrites: true,
      mineArLocalBlocks: true,
    })
    .connect(wallet1.jwk);

  conntectedWallet2 = warp
    .contract(contract.contractTxId)
    .setEvaluationOptions({ internalWrites: true, mineArLocalBlocks: true })
    .connect(wallet2.jwk);

  // Mint AR to wallet1
  await fetch(
    // Mints 300 AR.
    `http://localhost:1984/mint/${wallet1.address}/100000000000000`
  );
});

test('should mint 1000 * 1e12', async () => {
  await connectedWallet.writeInteraction(
    { function: 'mint' },
    {
      reward: new BigNumber(1000 * 1e12)
        .integerValue(BigNumber.ROUND_DOWN)
        .toString(),
    }
  );
  const state = (await connectedWallet.readState()).cachedValue.state;
  assert.is(state.balances[wallet1.address], 1000000000);
});

test('should transfer 1000 * 1e6', async () => {
  await connectedWallet.writeInteraction({
    function: 'transfer',
    target: wallet2.address,
    qty: new BigNumber(1000 * 1e6)
      .integerValue(BigNumber.ROUND_DOWN)
      .toNumber(),
  });
  const state = (await connectedWallet.readState()).cachedValue.state;
  assert.is(state.balances[wallet2.address], 1000000000);
});

test.after(async () => {});

test.run();
