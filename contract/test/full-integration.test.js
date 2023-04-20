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
      balances: {
        [wallet1.address]: 100,
      },
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

test("mint 10 rebar", async () => {
  await connectedWallet1.writeInteraction(
    { function: "mint" },
    { reward: "10000000000000" }
  );
  const state = (await connectedWallet1.readState()).cachedValue.state;
  assert.is(state.balances[wallet1.address], 10000100);
});

test.skip("transfer", async () => {});

test.skip("allow", async () => {});

test.skip("claim", async () => {});

test.skip("balance", async () => {});

test.after(async () => {
  await arlocal.stop();
});

test.run();

// it('should claim with different txID', async () => {
//   await bar.connect(user2Wallet).writeInteraction(
//     {function: 'claim', qty: 2, txID: claim2txID}, {strict: true}
//   );

//   expect((await bar.viewState({function: 'balance'})).result.balance)
//     .toEqual(3);

//   const state = (await bar.readState()).cachedValue.state;
//   expect(state.claimable.length).toEqual(0);
//   expect(state.claims[1]).toEqual(claim2txID);
// });

// it('should claim again without causing an effect', async () => {
//   await bar.connect(user2Wallet).writeInteraction(
//     {function: 'claim', qty: 1, txID: claim1txID}, {strict: true}
//   );

//   expect((await bar.viewState({function: 'balance'})).result.balance)
//     .toEqual(1);
// });
