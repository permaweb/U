import BigNumber from 'bignumber.js';
import Arweave from 'arweave';
import { compose, prop, fromPairs, toPairs, map, mergeWith, add } from 'ramda';
import { getBalances as getBundlrBalances } from './get-balances.mjs';
import fs from 'fs';
import { writeFile } from 'fs/promises';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

const BAR = 'VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA';
const DRE = 'https://cache-2.permaweb.tools';

export async function setup(folder) {
  const BAR_STATE = await fetch(`${DRE}/contract/?id=${BAR}`)
    .then((r) => r.json())
    .then(prop('state'));
  const balances = getBalances(BAR_STATE);
  // const bundlrBalances = await getBundlrBalances();

  // const mergeBalances = mergeWith(add);

  // const newBalances = mergeBalances(balances, bundlrBalances);

  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
  // const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', jwk);

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
      requests: [],
    },
  };

  const initialStateSEQ = {
    ...stateFromFileSEQ,
    ...{
      owner: process.env.WALLET_ADDRESS,
      balances: {
        ...balances,
        'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw': 0,
        'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI': 0,
        '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4': 0,
        uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk: 0,
        // 'ZE0N-8P9gXkhtK-07PQu9d8me5tGDxa_i4Mee5RzVYg': 0,
        // 'OXcT1sVRSA5eGwt2k6Yuz8-3e3g9WJi5uSE99CWqsBs': 0,
      },
    },
  };

  return {
    jwk,
    initialStateSEQ,
    initialStateL1,
    contractSrcSEQ,
    contractSrcL1,
    ids: {},
  };
}

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

export async function deployL1({
  jwk,
  initialStateSEQ,
  initialStateL1,
  contractSrcSEQ,
  contractSrcL1,
  ids,
}) {
  const encoder = new TextEncoder();
  const encodedBytesSeqSrc = encoder.encode(JSON.stringify(contractSrcL1));
  const srcTx = await arweave.createTransaction({
    data: contractSrcL1,
    reward: '390115313',
  });
  srcTx.addTag('Content-Type', 'application/javascript');
  await arweave.transactions.sign(srcTx, jwk);
  await arweave.transactions.post(srcTx);
  console.log('srcId', srcTx.id);
  ids['l1Src'] = srcTx.id;

  await waitForConfirmation(srcTx.id, 'l1Src', encodedBytesSeqSrc.byteLength);
  // deploy contract
  const contractTx = await arweave.createTransaction({
    data: JSON.stringify(initialStateL1),
    reward: '390115313',
  });
  contractTx.addTag('Content-Type', 'application/json');
  contractTx.addTag('App-Name', 'SmartWeaveContract');
  contractTx.addTag('App-Version', '0.3.0');
  contractTx.addTag('Contract-Src', srcTx.id);
  contractTx.addTag(
    'Contract-Manifest',
    JSON.stringify({
      evaluationOptions: {
        sourceType: 'arweave',
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip',
      },
    })
  );
  await arweave.transactions.sign(contractTx, jwk);
  await arweave.transactions.post(contractTx);
  console.log('contractTx', contractTx.id);
  ids['l1Init'] = contractTx.id;
  const encodedBytesSeqInit = encoder.encode(JSON.stringify(initialStateL1));

  await waitForConfirmation(
    contractTx.id,
    'l1Init',
    encodedBytesSeqInit.byteLength
  );

  return {
    jwk,
    initialStateSEQ,
    contractSrcSEQ,
    ids,
  };
}

export async function deploySEQ({ jwk, initialStateSEQ, contractSrcSEQ, ids }) {
  const encoder = new TextEncoder();
  const encodedBytesSeqSrc = encoder.encode(JSON.stringify(contractSrcSEQ));
  const srcTx = await arweave.createTransaction({
    data: contractSrcSEQ,
    reward: '390115313',
  });
  srcTx.addTag('Content-Type', 'application/javascript');
  await arweave.transactions.sign(srcTx, jwk);
  await arweave.transactions.post(srcTx);
  console.log('srcId', srcTx.id);
  ids['seqSrc'] = srcTx.id;
  await waitForConfirmation(srcTx.id, 'seqSrc', encodedBytesSeqSrc.byteLength);

  const encodedBytesSeqInit = encoder.encode(
    JSON.stringify({ ...initialStateSEQ, mint_contract: ids['l1Init'] })
  );

  // deploy contract
  const contractTx = await arweave.createTransaction({
    data: JSON.stringify({ ...initialStateSEQ, mint_contract: ids['l1Init'] }),
    reward: Math.ceil(14521652465 + 0.1 * 14521652465).toString(),
  });
  contractTx.addTag('Content-Type', 'application/json');
  contractTx.addTag('App-Name', 'SmartWeaveContract');
  contractTx.addTag('App-Version', '0.3.0');
  contractTx.addTag('Contract-Src', srcTx.id);
  contractTx.addTag(
    'Contract-Manifest',
    JSON.stringify({
      evaluationOptions: {
        sourceType: 'redstone-sequencer',
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip',
      },
    })
  );
  await arweave.transactions.sign(contractTx, jwk);
  await arweave.transactions.post(contractTx);
  console.log('contractTx', contractTx.id);
  ids['seqInit'] = contractTx.id;
  await waitForConfirmation(
    contractTx.id,
    'seqInit',
    encodedBytesSeqInit.byteLength
  );

  return ids;
}

export async function writeIds(ids) {
  await writeFile('./deploy-output-confirmed.json', JSON.stringify(ids));
}

async function waitForConfirmation(transactionId, label, size) {
  let res = null;

  while (res === null || res?.status === 202) {
    await new Promise((resolve) => setTimeout(resolve, 20000)); // Delay for 1 second
    res = await fetch(`https://arweave.net/tx/${transactionId}`);
    console.log(JSON.stringify(res));
    res.status;
    console.log(`${label} status: ${res.status} -- ${size}`);
  }

  if (res?.status === 200) {
    console.log('Transaction confirmed!');
  } else {
    console.log(
      'Transaction failed :(',
      res.status,
      res.statusText,
      await res.text()
    );
    process.exit(1);
  }
}
