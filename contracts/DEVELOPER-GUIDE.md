# Developers

A guide to using the RebAR.

- [Developers](#developers)
  - [Summary](#summary)
  - [Architecture](#architecture)
  - [Prerequisites](#prerequisites)
  - [Contract Functions](#contract-functions)
    - [Create Mint (L1)](#create-mint-l1)
    - [Get Queue (L1)](#get-queue-l1)
    - [Mint (SEQ)](#mint-seq)
    - [Transfer (SEQ)](#transfer-seq)
    - [Allow (SEQ)](#allow-seq)
    - [Claim (SEQ)](#claim-seq)
  - [Resources](#resources)

## Summary

The RebAR contract, is 2 contracts.

1. L1 Contract: This contract will only accept base layer transactions. [Initial State](./initial-state-L1.json)
2. Sequencer Contract: This contract will only accept WARP_SEQUENCER transactions. [Initial State](./initial-state-SEQ.json)

> Why?

Great question.

There are 2 key points for why the contract was split:

1. **GAS**: The `mint` must be initiated on the Base Layer, so that a reward can be processed with the transaction.  You are Burning your AR tokens, which means you are paying the Endowment in AR to receive RebAR tokens.
2. **GASLESS**:All other functions (specifically `transfer` function) must go through the Sequencer.  This prevents a user from submitting a transfer transaction on the base layer, then submitting a new L2 transaction with the same tokens. The results are fast(sub-second), consistent state updates.

## Architecture

As the mint process has been split in 2, below is the architecture of the new process. To find out more about restricting contract interactions and skipping any "unsafe" interaction, checkout these links:

- [Contract Manifest](https://docs.warp.cc/docs/sdk/advanced/manifest/).
- [Contract Evaluation Options](https://docs.warp.cc/docs/sdk/advanced/evaluation-options#sourcetype-evaluation-option).

See below for the Architecture documents of the new mint process, and the Foreign Call Protocol.

- [Mint](./images/mint.png)
- [FCP](./images/fcp.png)

## Prerequisites

- Node v18
- warp-contracts

## Contract Functions

> L1

- `create-mint`
- `get-queue`

> Sequencer

- `mint`
- `transfer`
- `allow`
- `claim`

### Create Mint (L1)

The `create-mint` function is a Layer 1 only function and cannot be a bundled transaction.

> Input

- `function`: `create-mint`

A working test can be found [here](./test/full-integration.test.js)

> warp-contracts (npm i warp-contracts)

```js
const connectedWallet1L1 = warp
  .contract(contractL1.contractTxId)
  .connect('use_wallet');

await connectedWallet1L1.writeInteraction(
  { function: 'create-mint' },
  { reward: '10000000000000' }
);
```

> arweave (npm i arweave)

```js
import Arweave from 'arweave';

const jwk = JSON.parse(fs.readFileSync('./wallet.json').toString());

// initialize arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

const tx = await arweave.createTransaction(
  {
    reward: '1000000000000', // 1 AR
  },
  jwk
);

tx.addTag('App-Name', 'SmartWeaveAction');
tx.addTag('App-Version', '0.3.0');
tx.addTag('Contract', REBAR_CONTRACT);

const input = JSON.stringify({
  function: 'create-mint',
});

tx.addTag('Input', input);

arweave.transactions.sign(tx, jwk);

arweave.transactions.post(tx).then(console.log).catch(console.log);
```

### Get Queue (L1)

The `get-queue` function returns `state.requests`. The object structure is `{"<tx1>": { qty: number, expires: number(block), target: "<addr>"}, "<tx2>": { qty: number, expires: number(block), target: "<addr>"}, ...}`.

> Input

- `function`: `get-queue`

> warp-contracts (npm i warp-contracts)

```js
const state = await warp
  .contract(tx)
  .setEvaluationOptions({
    internalWrites: true,
    allowBigInt: true,
  })
  .viewState({ function: 'get-queue' });
const requests = state.result;
```

### Mint (SEQ)

The `mint` function views the state of the L1 contract to get `state.requests`. It then checks its own state (`state.pile`) to filter out any requsts that are already in the pile (or mints that have been processed, so they've been thrown in the `pile`). Finally, update balances for any un-processed requests.

> Input

- `function`: `mint`

> warp-contracts (npm i warp-contracts)

```js
const connectedWallet1SEQ = warp
  .contract(contractSEQ.contractTxId)
  .connect('use_wallet');

await connectedWallet1SEQ.writeInteraction({ function: 'mint' });
```

### Transfer (SEQ)

The `transfer` function transfers RebAR tokens from the connected wallet to another address.

> Input

- `function`: `transfer`
- `qty`: The integer value being transferred.
- `target`: The address of the wallet the RebAR is being transferred to.

> warp-contracts (npm i warp-contracts)

```js
const connectedWallet1SEQ = warp
  .contract(contractSEQ.contractTxId)
  .connect('use_wallet');

await connectedWallet1SEQ.writeInteraction({
  function: 'transfer',
  target: wallet2.address,
  qty: 5000000,
});
```

### Allow (SEQ)

> Foreign Call Protocol (FCP): Step 1

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
const connectedWallet1SEQ = warp
  .contract(contractSEQ.contractTxId)
  .connect('use_wallet');

const interaction1 = await connectedWallet1SEQ.writeInteraction({
  function: 'allow',
  target: wallet1.address,
  qty: 2000000,
});
```

### Claim (SEQ)

> Foreign Call Protocol (FCP): Step 2

The `claim` function claims a transfer request that was initiated by the `allow` function.

> Input

- `function`: `claim`
- `txID`: The transaction id of the `allow` request.
- `qty`: The integer value being transferred.

> warp-contracts (npm i warp-contracts)

```js
const connectedWallet1SEQ = warp
  .contract(contractSEQ.contractTxId)
  .connect('use_wallet');

await connectedWallet1SEQ.writeInteraction({
  function: 'claim',
  txID: interaction1.originalTxId,
  qty: 2000000,
});
```

## Resources

- [Arweave](https://arweave.org)
- [Cookbook](https://cookbook.g8way.io)
