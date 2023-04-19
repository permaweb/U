# REBAR Contract

This contract is the reBAR contract.

## Build

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
