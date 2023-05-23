import { WarpFactory, SourceType } from 'warp-contracts';
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy';
import BigNumber from 'bignumber.js';
import { compose, prop, fromPairs, toPairs, map } from 'ramda';

import fs from 'fs';

const BAR = 'VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA';
const DRE = 'https://cache-2.permaweb.tools';

async function deploy(folder) {
  const BAR_STATE = await fetch(`${DRE}/contract/?id=${BAR}`)
    .then((r) => r.json())
    .then(prop('state'));
  const balances = getBalances(BAR_STATE);

  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
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
    },
  };

  const initialStateSEQ = {
    ...stateFromFileSEQ,
    ...{
      owner: process.env.WALLET_ADDRESS,
    },
  };

  const deployL1 = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
    initState: JSON.stringify(initialStateL1),
    src: contractSrcL1,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.ARWEAVE,
        unsafeClient: 'skip',
        internalWrites: false,
      },
    },
  });

  const deploySEQ = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
    initState: JSON.stringify({
      ...initialStateSEQ,
      mint_contract: deployL1.contractTxId,
    }),
    src: contractSrcSEQ,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.WARP_SEQUENCER,
        internalWrites: true,
        unsafeClient: 'skip',
      },
    },
  });
  console.log(`L1 contractTxId ${deployL1.contractTxId}`);
  console.log(`SEQ contractTxId ${deploySEQ.contractTxId}`);

  const connected = warp
    .contract(deploySEQ.contractTxId)
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
    })
    .connect(jwk);
  const interaction = await connected.writeInteraction({
    function: 'initialize',
    initialBalances: { ...balances },
  });

  console.log(`Balances migrated: ${interaction.originalTxId}`);
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
