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
let arlocal;

const test = suite("handle-L1");

test.before(async () => {
  arlocal = new ArLocal.default();
  await arlocal.start();
  LoggerFactory.INST.logLevel("error");
  warp = WarpFactory.forLocal().use(new DeployPlugin());

  // Generate a wallet
  wallet1 = await warp.generateWallet();

  // Grab the contract and initial state
  const prefix = `./dist/`;
  const contractSrc = fs.readFileSync(`${prefix}contract-L1.js`, "utf8");
  const state = JSON.parse(
    fs.readFileSync(`${prefix}initial-state-L1.json`, "utf8")
  );

  // Update initial state giving the wallet 100
  const initialState = {
    ...state,
    ...{
      owner: wallet1.address,
      requests: {
        expired: {
          expires: 0,
        },
        "not-expired": {
          expires: 0,
        },
      },
    },
  };

  // Deploy contract
  const { contractTxId } = await warp.deploy({
    wallet: wallet1.jwk,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });

  console.log("contractTxId", contractTxId);

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

test("should filter out expired requests", async () => {
  console.log("RUNNING TEST");
  await connectedWallet1.writeInteraction({ function: "create-mint" });
  console.log("RAN CREATE MINT");
  const state = (await connectedWallet1.readState()).cachedValue.state;
  console.log("STATE", state);
  assert.is(state.ticker, "REBAR");
});

test.after(async () => {
  await arlocal.stop();
});

test.run();
