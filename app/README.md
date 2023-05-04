# RebAR UI

The UI / Renderer for the RebAR SmartWeave contracts.

- [RebAR UI](#rebar-ui)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Build](#build)
  - [Run](#run)
  - [Launch With Contracts](#launch-with-contracts)
    - [Mint ArLocal AR Tokens](#mint-arlocal-ar-tokens)
  - [Resources](#resources)


## Prerequisites

- NodeJS v18

## Install

```sh
npm i
```

## Build

```sh
npm run build
```

## Run

```sh
npm run dev
```

## Launch With Contracts

> From the root of the repository.

**_Start arlocal_**

```sh
npx arlocal
```

**_Launch app_**

```sh
npm run launch
```

### Mint ArLocal AR Tokens

Replace `<YOUR-ADDRESS>` the arweave wallet you connect to the app.

- http://localhost:1984/mint/<YOUR-ADDRESS>/100000000000000

## Resources

- [Arweave](https://arweave.org)
- [Cookbook](https://cookbook.g8way.io)
