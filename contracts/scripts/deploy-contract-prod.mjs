import { WarpFactory, SourceType } from 'warp-contracts';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import BigNumber from 'bignumber.js';
import Arweave from 'arweave';
import { compose, prop, fromPairs, toPairs, map, mergeWith, add } from 'ramda';
import { getBalances as getBundlrBalances } from './get-balances.mjs';
// import Bundlr from '@bundlr-network/client';
import fs from 'fs';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

const BAR = 'VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA';
const DRE = 'https://cache-2.permaweb.tools';

async function deploy(folder) {
  // const BAR_STATE = await fetch(`${DRE}/contract/?id=${BAR}`)
  //   .then((r) => r.json())
  //   .then(prop('state'));
  // const balances = getBalances(BAR_STATE);
  // const bundlrBalances = await getBundlrBalances();

  // const mergeBalances = mergeWith(add);

  // const newBalances = mergeBalances(balances, bundlrBalances);

  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
  // const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', jwk);

  const warp = WarpFactory.forMainnet().use(new DeployPlugin());
  const contractSrcL1 = fs.readFileSync(`${folder}/contract-L1.js`, 'utf8');
  const stateFromFileL1 = JSON.parse(
    fs.readFileSync(`${folder}/initial-state-L1.json`, 'utf8')
  );
  const contractSrcSEQ = fs.readFileSync(`${folder}/contract-SEQ.js`, 'utf8');
  const stateFromFileSEQ = JSON.parse(
    fs.readFileSync(`${folder}/initial-state-SEQ.json`, 'utf8')
  );
  if (!process.env.WALLET_ADDRESS) {
    console.error(
      'Set proces.env.WALLET_ADDRESS to your wallet addres. eg. 9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4'
    );
    process.exit(1);
  }
  const initialStateL1 = {
    ...stateFromFileL1,
    ...{
      owner: process.env.WALLET_ADDRESS,
      requests: [
        {
          expires: 1186976,
          qty: 10000,
          target: '9EIo8Qm0gPXIqMpzx8nrZ0YYDGaAnMWXhrPdvXIO0Fg',
          tx: 'kP8MfkO0psNn_4nP6z6XfpsiTNq2Mxsb0Dg30FQ4ymk',
        },
      ],
    },
  };

  const initialStateSEQ = {
    ...stateFromFileSEQ,
    ...{
      owner: process.env.WALLET_ADDRESS,
      balances: {
        // ...balances,
        // 'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw': 0,
        // 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI': 0,
        // '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4': 0,
        // uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk: 0,
      },
    },
  };

  // const deployL1 = await warp.deploy(
  //   {
  //     wallet: new ArweaveSigner(jwk),
  //     // wallet: jwk,
  //     initState: JSON.stringify(initialStateL1),
  //     src: contractSrcL1,
  //     evaluationManifest: {
  //       evaluationOptions: {
  //         sourceType: SourceType.ARWEAVE,
  //         unsafeClient: 'skip',
  //         allowBigInt: true,
  //         internalWrites: true,
  //       },
  //     },
  //   }
  //   // true
  // );

  // const deploySEQ = await warp.deploy({
  //   wallet: new ArweaveSigner(jwk),
  //   // wallet: jwk,
  //   initState: JSON.stringify({
  //     ...initialStateSEQ,
  //     mint_contract: deployL1.contractTxId,
  //   }),
  //   src: contractSrcSEQ,
  //   evaluationManifest: {
  //     evaluationOptions: {
  //       sourceType: SourceType.WARP_SEQUENCER,
  //       internalWrites: true,
  //       unsafeClient: 'skip',
  //       allowBigInt: true,
  //     },
  //   },
  // });
  // console.log(`L1 contractTxId ${deployL1.contractTxId}`);
  // console.log(`SEQ contractTxId ${deploySEQ.contractTxId}`);

  // STEP 1: upload L1 source

  const l1SrcTx = await arweave.createTransaction(
    {
      data: contractSrcL1,
    },
    jwk
  );
  l1SrcTx.addTag('App-Name', 'SmartWeaveContractSource');
  l1SrcTx.addTag('App-Version', '0.3.0');
  l1SrcTx.addTag('Content-Type', 'application/javascript');
  await arweave.transactions.sign(l1SrcTx, jwk);
  await arweave.transactions.post(l1SrcTx);

  await waitForConfirmation(l1SrcTx.id, 'l1src');

  console.log(`l1 source deployed: ${l1SrcTx.id}`);

  // STEP 2: initialize contract with l1 source id
  const l1InitTx = await arweave.createTransaction(
    {
      data: JSON.stringify({
        ...initialStateL1,
      }),
    },
    jwk
  );
  l1InitTx.addTag('App-Name', 'SmartWeaveContract');
  l1InitTx.addTag('App-Version', '0.3.0');
  l1InitTx.addTag('Contract-Src', l1SrcTx.id);
  l1InitTx.addTag('Content-Type', 'application/javascript');
  l1InitTx.addTag(
    'Contract-Manifest',
    '{"evaluationOptions":{"sourceType":"arweave","internalWrites":true,"unsafeClient":"skip","allowBigInt":true}}'
  );

  await arweave.transactions.sign(l1InitTx, jwk);
  await arweave.transactions.post(l1InitTx);

  await waitForConfirmation(l1InitTx.id, 'l1InitTx');

  console.log(`l1 contract initialized: ${l1InitTx.id}`);

  // STEP 3: Deploy l2 src
  const l2SrcTx = await arweave.createTransaction(
    {
      data: contractSrcSEQ,
    },
    jwk
  );
  l2SrcTx.addTag('App-Name', 'SmartWeaveContractSource');
  l2SrcTx.addTag('App-Version', '0.3.0');
  l2SrcTx.addTag('Content-Type', 'application/javascript');

  await arweave.transactions.sign(l2SrcTx, jwk);
  await arweave.transactions.post(l2SrcTx);

  await waitForConfirmation(l2SrcTx.id, 'l2SrcTx');

  console.log(`l2 source deployed: ${l2SrcTx.id}`);

  const l2InitTx = await arweave.createTransaction(
    {
      data: JSON.stringify({
        ...initialStateSEQ,
        mint_contract: l1InitTx.id,
      }),
    },
    jwk
  );
  l2InitTx.addTag('App-Name', 'SmartWeaveContract');
  l2InitTx.addTag('App-Version', '0.3.0');
  l2InitTx.addTag('Contract-Src', l2SrcTx.id);
  l2InitTx.addTag('SDK', 'Warp');
  l2InitTx.addTag('Content-Type', 'application/javascript');
  l2InitTx.addTag(
    'Contract-Manifest',
    '{"evaluationOptions":{"sourceType":"redstone-sequencer","internalWrites":true,"unsafeClient":"skip","allowBigInt":true}}'
  );

  await arweave.transactions.sign(l2InitTx, jwk);
  await arweave.transactions.post(l2InitTx);

  await waitForConfirmation(l2InitTx.id, 'l2InitTx');

  console.log(`L1: ${l1InitTx.id} L2: ${l2InitTx.id}`);
}

deploy(process.argv[2]).catch(console.log);

function getBalances(state) {
  return compose(
    fromPairs,
    map(([k, v]) => [
      k,
      new BigNumber(v).integerValue(BigNumber.ROUND_DOWN).toNumber(),
    ]),
    toPairs,
    prop('balances')
  )(state);
}

async function waitForConfirmation(transactionId, label) {
  let status = await arweave.transactions.getStatus(transactionId);

  while (!status.confirmed && !status.failed) {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay for 1 second
    status = await arweave.transactions.getStatus(transactionId);
    console.log(`${label} status: ${status.status}`);
  }

  if (status.confirmed) {
    console.log('Transaction confirmed!');
  } else {
    console.log('Transaction failed :(');
    process.exit(1);
  }
}
