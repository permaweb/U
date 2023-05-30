import { WarpFactory, SourceType, defaultCacheOptions } from 'warp-contracts';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import { map, omit } from 'ramda';
import BigNumber from 'bignumber.js';

import fs from 'fs';
export function roundDown(v) {
  const intValue = new BigNumber(v).integerValue(BigNumber.ROUND_DOWN);
  console.log('VALUE', intValue);
  return intValue.toNumber();
}
async function deploy(folder) {
  const balances = await fetch(
    'https://cache-2.permaweb.tools/contract/?id=VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA'
  )
    .then((res) => res.json())
    .then((result) => result.state.balances)
    .then(
      omit([
        'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI',
        '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
        'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw',
        '89tR0-C1m3_sCWCoVCChg4gFYKdiH5_ZDyZpdJ2DDRw',
        'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
      ])
    )
    .then(map((v) => roundDown(v)));

  console.log(
    'BALANCE',
    balances['VYDyg7TPf5tB4wqeCOklGx5VWjrbRFkDnsCuFaWhtb8']
  );

  // const jwk = JSON.parse(
  //   fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  // );
  // const warp = WarpFactory.forMainnet(defaultCacheOptions, true).use(
  //   new DeployPlugin()
  // );
  // const contractSrc = fs.readFileSync(`${folder}/contract.js`, 'utf8');
  // const stateFromFile = JSON.parse(
  //   fs.readFileSync(`${folder}/initial-state.json`, 'utf8')
  // );
  // if (!process.env.WALLET_ADDRESS) {
  //   console.error(
  //     'Set proces.env.WALLET_ADDRESS to your wallet addres. eg. 9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4'
  //   );
  //   process.exit(1);
  // }

  // const initialState = {
  //   ...stateFromFile,
  //   ...{
  //     owner: process.env.WALLET_ADDRESS,
  //   },
  // };

  // const deployed = await warp.deploy(
  //   {
  //     // wallet: new ArweaveSigner(jwk),
  //     wallet: jwk,
  //     initState: JSON.stringify({
  //       ...initialState,
  //       balances,
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
  // console.log(`SEQ contractTxId ${deployed.contractTxId}`);
  // await waitForConfirmation(deployed.contractTxId);
}
deploy(process.argv[2]).catch(console.log);

export async function waitForConfirmation(tx) {
  let res = null;

  while (res === null || res?.status === 202) {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for 20 second
    res = await fetch(`https://arweave.net/tx/${tx}`);
    console.log('Status:', res?.status);
  }
  console.log('Finished with status:', res.status, res.statusText);
}
