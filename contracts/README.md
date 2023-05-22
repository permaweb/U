# RebAR Contracts

This folder contains the L1 contract to create a RebAR mint, and the SEQUENCER contract for RebAR. The L1 contract initiates a mint on the Arweave base layer and when this transaction is confirmed, the SEQUENCER contract can process the mint and update the users balance. Everything else (transfer, Foreign Call Protocol (allow / claim), balance) happens on the SEQUENCER contract. Once you enter the Permaweb, you are on L2.

- [RebAR Contracts](#rebar-contracts)
  - [Build](#build)
  - [Test](#test)
  - [Deploy](#deploy)
  - [Resources](#resources)

## Build

This commit was added to fix how `esbuild` imports `BigNumber` https://github.com/permaweb/rebar/pull/27/commits/a1f3005de4b53fdd0ba175febcc9385aab51f9cc.

eg.

```js
// ./scripts/build.js

replace.sync({
  files: './dist/contract.js',
  from: ['var BigNumber = clone();'],
  to: 'var BigNumberClone = clone();',
  countMatches: true,
});
replace.sync({
  files: './dist/contract.js',
  from: ['var bignumber_default = BigNumber;'],
  to: 'var bignumber_default = BigNumberClone;',
  countMatches: true,
});
```

`npm run build`

## Test

`npm test`

## Deploy

Pre-requisites:

- Set `WALLET_ADDRESS` env var to your wallet address.
- Set `PATH_TO_WALLET` env var to the path to your keyfile.

```sh
echo '\nexport WALLET_ADDRESS=<address>' >> ~/.zshrc # or ~/.bashrc ?
echo '\nexport PATH_TO_WALLET=<path/wallet.json>' >> ~/.zshrc # or ~/.bashrc ?

```

`npm run deploy`

or:

`PATH_TO_WALLET=<path/to/wallet.json> WALLET_ADDRESS=<address> npm run deploy`

## Resources

- [Arweave](https://arweave.org)
- [Cookbook](https://cookbook.g8way.io)
