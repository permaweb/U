import { WarpFactory } from 'warp-contracts';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import BigNumber from 'bignumber.js'
import { compose, prop, fromPairs, toPairs, map } from 'ramda'

import fs from 'fs';

const BAR = 'VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA'
const DRE = 'https://cache-2.permaweb.tools'

async function deploy(folder) {
  const BAR_STATE = await fetch(`${DRE}/contract/?id=${BAR}`).then(r => r.json()).then(prop('state'))
  const balances = getBalances(BAR_STATE)

  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
  const warp = WarpFactory.forMainnet().use(new DeployPlugin());
  const contractSrc = fs.readFileSync(`${folder}/contract.js`, 'utf8');
  const stateFromFile = JSON.parse(
    fs.readFileSync(`${folder}/initial-state.json`, 'utf8')
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
      balances
    },
  };

  const deploy = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });
  console.log(`contractTxId ${deploy.contractTxId}`);

}
deploy(process.argv[2]).catch(console.log);


function getBalances(state) {
  return compose(
    fromPairs,
    map(
      ([k, v]) => ([k, (new BigNumber(v).integerValue())])
    ),
    toPairs,
    prop('balances')
  )(state)
}