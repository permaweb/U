import { suite } from "uvu";
import * as assert from "uvu/assert";
import { WarpFactory, LoggerFactory } from "warp-contracts/mjs";
import { DeployPlugin } from "warp-contracts-plugin-deploy";
import ArLocal from "arlocal";
import * as fs from "fs";

// Things that need to be used in multiple blocks
// for example, we start arlocal in the .before() and stop it in the .after()
let warp;
let wallet1;
let connectedWallet1;
let wallet2;
let connectedWallet2;
let arlocal;
// This will be set after allow, and be used for claiming
let allowTxForClaim1;
let allowTxForClaim2;

const test = suite("full-integration");

test.before(async () => {
  arlocal = new ArLocal.default();
  await arlocal.start();
  LoggerFactory.INST.logLevel("error");
  warp = WarpFactory.forLocal().use(new DeployPlugin());

  // Generate a wallet
  wallet1 = await warp.generateWallet();
  wallet2 = await warp.generateWallet();

  // Grab the contract and initial state
  const prefix = `./dist/`;
  const contractSrc = fs.readFileSync(`${prefix}contract.js`, "utf8");
  const state = JSON.parse(
    fs.readFileSync(`${prefix}initial-state.json`, "utf8")
  );

  // Update initial state giving the wallet 100
  const initialState = {
    ...state,
    ...{
      owner: wallet1.address,
    },
  };

  // Deploy contract
  const { contractTxId } = await warp.deploy({
    wallet: wallet1.jwk,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });

  // Connect wallet to contract
  connectedWallet1 = warp
    .contract(contractTxId)
    .setEvaluationOptions({ internalWrites: true, mineArLocalBlocks: true })
    .connect(wallet1.jwk);

  connectedWallet2 = warp
    .contract(contractTxId)
    .setEvaluationOptions({ internalWrites: true, mineArLocalBlocks: true })
    .connect(wallet2.jwk);

  // Mint AR to wallet1
  await fetch(
    // Mints 300 AR.
    `http://localhost:1984/mint/${wallet1.address}/100000000000000`
  );
});

test("mint 10 rebar with wallet1", async () => {
  await connectedWallet1.writeInteraction(
    { function: "mint" },
    { reward: "10000000000000" }
  );
  const state = (await connectedWallet1.readState()).cachedValue.state;
  assert.is(state.balances[wallet1.address], 10000000);
});

test("transfer 5 to wallet 2", async () => {
  await connectedWallet1.writeInteraction({
    function: "transfer",
    target: wallet2.address,
    qty: 5000000,
  });
  const state = (await connectedWallet1.readState()).cachedValue.state;
  assert.is(state.balances[wallet2.address], 5000000);
});

test("allow 2 with wallet 2 (to wallet 1) - allow 1 with wallet 2", async () => {
  const interaction1 = await connectedWallet2.writeInteraction({
    function: "allow",
    target: wallet1.address,
    qty: 2000000,
  });

  const interaction2 = await connectedWallet2.writeInteraction({
    function: "allow",
    target: wallet1.address,
    qty: 1000000,
  });

  const state = (await connectedWallet1.readState()).cachedValue.state;
  assert.is(state.claimable.length, 2);

  // Set the allow tx for claim next
  allowTxForClaim1 = interaction1.originalTxId;
  allowTxForClaim2 = interaction2.originalTxId;
});

test("claim 2 with wallet 1", async () => {
  await connectedWallet1.writeInteraction({
    function: "claim",
    txID: allowTxForClaim1,
    qty: 2000000,
  });
  const state = (await connectedWallet1.readState()).cachedValue.state;
  assert.is(state.balances[wallet1.address], 7000000);
  assert.is(state.balances[wallet2.address], 2000000);
});

test("should claim with different txID", async () => {
  await connectedWallet1.writeInteraction({
    function: "claim",
    txID: allowTxForClaim2,
    qty: 1000000,
  });
  const state = (await connectedWallet1.readState()).cachedValue.state;
  assert.is(state.balances[wallet1.address], 8000000);
  assert.is(state.balances[wallet2.address], 2000000);
});

test("check balance with target", async () => {
  const balanceFunc = await connectedWallet1.viewState({
    function: "balance",
    target: wallet2.address,
  });
  assert.is(balanceFunc.result.balance, 2000000);
});

test("check balance without target", async () => {
  const balanceFunc = await connectedWallet1.viewState({
    function: "balance",
  });
  assert.is(balanceFunc.result.balance, 8000000);
});

test.after(async () => {
  await arlocal.stop();
});

test.run();
