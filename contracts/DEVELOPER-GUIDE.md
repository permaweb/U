# Developers

A guide to using the RebAR.

- [Developers](#developers)
  - [Summary](#summary)
  - [Architecture](#architecture)
  - [Foreign Call Protocol (FCP)](#foreign-call-protocol-fcp)
  - [Prerequisites](#prerequisites)
  - [Contract Functions](#contract-functions)
    - [Mint (L1)](#mint-l1)
    - [Transfer (SEQ)](#transfer-seq)
    - [Allow (SEQ)](#allow-seq)
    - [Claim (SEQ)](#claim-seq)
    - [Reject (SEQ)](#reject-seq)
  - [Resources](#resources)

## Summary

The RebAR contract has 2 types of transactions: 

1. Layer 1 transactions, which are the only type of trasaction allowed for `mint` (burn)
2. Layer 2 (Sequencer) transactions, which are the only typle allowed for `transfer`, `allow`, `claim`, `reject`.

> Why?

Great question.

There are 2 key points:

1. **GAS**: The `mint` must be initiated on the Base Layer, so that a reward can be processed with the transaction.  You are Burning your AR tokens, which means you are paying the Endowment in AR to receive RebAR tokens.
2. **GASLESS**: All other functions (specifically `transfer` function) must go through the Sequencer.  This prevents a user from submitting a transfer transaction on the base layer, then submitting a new L2 transaction with the same tokens. The results are fast(sub-second), consistent state updates.

## Architecture

In order to verify that the `mint` (burn) function only happens on the Arweave base layer, the contract is looking for a **reward** (fee) greater than the **reward** that would be sent by the Warp Sequencer. This means the contract will throw an error if anyone tries call the `mint` function via Sequencer.

This allows us to have 1 contract that can split functionality between L1 and L2. L1 is used to enter rebar, and once entered, everything else happens instantly on the Warp Sequencer (via Bundlr Network).

- [Contract Manifest](https://docs.warp.cc/docs/sdk/advanced/manifest/).
- [Contract Evaluation Options](https://docs.warp.cc/docs/sdk/advanced/evaluation-options#sourcetype-evaluation-option).

## Foreign Call Protocol (FCP)

This contract implements and extends the Foreign Call Protocol.  See the below doc for more information.

Additionally, there is a function called `reject` that can be used in this contract.  The `reject` function can be used by any wallet / contract id that has a claim assigned to it in the `claimable` array. The caller must pass `tx` as input to the function.  When called, the contract will check if the `caller` is the same as the `to` property in the `claimable` item.  If it is, the contract will reject the claim and send the tokens back to the `from` address specified in the `claimable`

- [Spec](https://specs.arweave.dev/?tx=iXHbTuV7kUR6hQGwNjdnYFxxp5HBIG1b3YI2yy7ws_M)
## Prerequisites

- Node v18
- warp-contracts

## Contract Functions

### Mint (L1)

The `mint` function views the state of the L1 contract to get `state.requests`. It then checks its own state (`state.pile`) to filter out any requsts that are already in the pile (or mints that have been processed, so they've been thrown in the `pile`). Finally, update balances for any un-processed requests.

> Input

- `function`: `mint`

> warp-contracts (npm i warp-contracts)

```js
await warp
    .contract(REBAR_CONTRACT_ID)
    .connect('use_wallet')
    .setEvaluationOptions({
      remoteStateSyncEnabled: true,
      unsafeClient: 'skip',
      allowBigInt: true,
      internalWrites: true,
    })
    .writeInteraction(
      {
        function: 'mint',
      },
      {
        disableBundling: true,
        reward: "1000000000000", // 1 rebar (you can change this to whatever you want as long as its greater than `72600854` winston)
      }
    );
```

### Transfer (SEQ)

The `transfer` function transfers RebAR tokens from the connected wallet to another address.

> Input

- `function`: `transfer`
- `qty`: The integer value being transferred.
- `target`: The address of the wallet the RebAR is being transferred to.

> warp-contracts (npm i warp-contracts)

```js
const connectedWallet = warp
  .contract(REBAR_CONTRACT_ID)
  .connect('use_wallet');

await connectedWallet.writeInteraction({
  function: 'transfer',
  target: wallet2.address,
  qty: 5000000,
});
```

### Allow (SEQ)

> Foreign Call Protocol (FCP)

The `allow` function is the first step in the Foreign Call Protocol, and allows for any address (eg. contract id or wallet address) to initiate a transfer that can be "claimed".

For example, if you have a contract (`foo` contract) that holds 10 assets, and each asset is set with a price of 1 **_RebAR_**. That contract can now require the caller to have created a "transfer" that can be "claimed". To purchase an asset, the user would need to:

- Run `allow` on RebAR for 1 token with `target` set to the **_contract id_** of the `foo` contract.

Now when the user calls the `foo` contract to purchase 1 of the 10 assets, the `foo` contract can call `claim` (step 2 of the FCP) on RebAR to claim the tokens before sending them to the user's wallet. (claim example below)

> Input

- `function`: `allow`
- `target`: The contract id or address of the wallet the RebAR is being transferred to
- `qty`: The integer value being transferred.

> warp-contracts (npm i warp-contracts)

```js
const connectedWallet = warp
  .contract(REBAR_CONTRACT_ID)
  .connect('use_wallet');

const interaction1 = await connectedWallet.writeInteraction({
  function: 'allow',
  target: wallet1.address,
  qty: 2000000,
});
```

### Claim (SEQ)

> Foreign Call Protocol (FCP)

The `claim` function claims a transfer request that was initiated by the `allow` function.

> Input

- `function`: `claim`
- `txID`: The transaction id of the `allow` request.
- `qty`: The integer value being transferred.

> warp-contracts (npm i warp-contracts)

```js
const connectedWallet = warp
  .contract(REBAR_CONTRACT_ID)
  .connect('use_wallet');

await connectedWallet.writeInteraction({
  function: 'claim',
  txID: interaction1.originalTxId,
  qty: 2000000,
});
```

### Reject (SEQ)

> Foreign Call Protocol (FCP)

The `reject` function rejects a transfer request that was initiated by the `allow` function.

> Input

- `function`: `reject`
- `tx`: The transaction id of the `allow` request.

> warp-contracts (npm i warp-contracts)

```js
const connectedWallet = warp
  .contract(REBAR_CONTRACT_ID)
  .connect('use_wallet');

await connectedWallet.writeInteraction({
  function: 'reject',
  tx: "<tx-from-allow-transaction>",
});
```

## Resources

- [Arweave](https://arweave.org)
- [Cookbook](https://cookbook.g8way.io)
