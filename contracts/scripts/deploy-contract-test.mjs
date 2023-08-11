import { WarpFactory, SourceType, defaultCacheOptions } from 'warp-contracts';
import {
  DeployPlugin,
  ArweaveSigner,
  InjectedArweaveSigner,
} from 'warp-contracts-plugin-deploy';
import { map, omit } from 'ramda';
import BigNumber from 'bignumber.js';

import fs from 'fs';
export function roundDown(v) {
  return new BigNumber(v).integerValue(BigNumber.ROUND_DOWN).toNumber();
}
async function deploy(folder) {
  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
  const warp = WarpFactory.forMainnet(defaultCacheOptions, true).use(
    new DeployPlugin()
  );

  const contractSrc = fs.readFileSync(`${folder}/test-contract.js`, 'utf8');
  const stateFromFile = JSON.parse(
    fs.readFileSync(`${folder}/test-initial-state.json`, 'utf8')
  );
  if (!process.env.WALLET_ADDRESS) {
    console.error(
      'Set proces.env.WALLET_ADDRESS to your wallet addres. eg. 9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4'
    );
    process.exit(1);
  }

  const initialState = {
    ...stateFromFile,
    ...{
      owner: process.env.WALLET_ADDRESS,
    },
  };

  const { contractTxId, srcTxId } = await warp.deploy({
    wallet: new InjectedArweaveSigner(jwk),
    initState: JSON.stringify({ ...initialState }),
    src: contractSrc,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.BOTH,
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip',
      },
    },
  });

  // const deployed = await warp.deploy(
  //   {
  //     // wallet: new ArweaveSigner(jwk),
  //     wallet: jwk,
  //     initState: JSON.stringify({
  //       ...initialState,
  //     }),
  //     src: contractSrc,
  //     evaluationManifest: {
  //       evaluationOptions: {
  //         sourceType: SourceType.BOTH,
  //         internalWrites: true,
  //         allowBigInt: true,
  //         unsafeClient: 'skip',
  //       },
  //     },
  //   },
  //   {
  //     disabledBundling: true,
  //   }
  // );
  console.log(`SEQ contractTxId ${contractTxId}, ${srcTxId}`);
  // console.log(`SEQ contractTxId ${deployed.contractTxId}`);
  // await waitForConfirmation(deployed.contractTxId);
}
deploy(process.argv[2]).catch(console.log);

export async function waitForConfirmation(tx) {
  let res = null;

  while (res === null || res?.status === 202) {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Delay for 10 second
    res = await fetch(`https://arweave.net/tx/${tx}`);
    console.log('Status:', res?.status);
  }
  console.log('Finished with status:', res.status, res.statusText);
}
