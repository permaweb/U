import { WarpFactory, SourceType } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import BigNumber from 'bignumber.js';
import { compose, prop, fromPairs, toPairs, map } from 'ramda';
import fs from 'fs';
import { execSync } from 'child_process';

const BAR = 'VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA';
const DRE = 'https://cache-2.permaweb.tools';

async function deploy(folder) {
  try {
    const BAR_STATE = await fetch(`${DRE}/contract/?id=${BAR}`)
      .then((r) => r.json())
      .then(prop('state'));
    const balances = getBalances(BAR_STATE);

    const warp = WarpFactory.forLocal().use(new DeployPlugin());
    const wallet1 = await warp.generateWallet();
    const contractSrcL1 = fs.readFileSync(`${folder}/contract-L1.js`, 'utf8');
    const stateFromFileL1 = JSON.parse(
      fs.readFileSync(`${folder}/initial-state-L1.json`, 'utf8')
    );
    const contractSrcSEQ = fs.readFileSync(`${folder}/contract-SEQ.js`, 'utf8');
    const stateFromFileSEQ = JSON.parse(
      fs.readFileSync(`${folder}/initial-state-SEQ.json`, 'utf8')
    );

    const initialStateL1 = {
      ...stateFromFileL1,
      ...{
        owner: process.env.WALLET_ADDRESS,
        requests: [
          {
            tx: 'r-ibjdYo03ZinmFB_1iWTMTwkz-1xgixg7BSC_t_EOM',
            target: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            qty: 2000000,
            expires: -1,
          },
          // {
          //   tx: 'r-ibjdYo03ZinmFB_1iWTMTwkz-1xgixg7BSC_t_EOM',
          //   target: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
          //   qty: 3000000,
          //   expires: -1,
          // },
          // {
          //   tx: 'oSrL1XAq5VKXxbQR0Lj43U-soLSl7NdupqGLM6bjDkI',
          //   target: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
          //   qty: 4000000,
          //   expires: 320,
          // },
          // {
          //   tx: '-oQ959JAVBjDMGCUkYA6yxlYHi9R3kjpb3WrB1kgnAs',
          //   target: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
          //   qty: 5000000,
          //   expires: 420,
          // },
          {
            tx: 'tT0FtnWOqLa8i0O5KvTISPPVkuQ85nCKZyViWurfIsk',
            target: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 6000000,
            expires: 520,
          },
        ],
      },
    };

    const initialStateSEQ = {
      ...stateFromFileSEQ,
      ...{
        owner: process.env.WALLET_ADDRESS,

        claimable: [
          {
            to: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            from: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 10000,
            txID: '<tx1>',
          },
          {
            to: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            from: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: '<tx2>',
          },
          {
            from: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            to: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: 'tT0FtnWOqLa8i0O5KvTISPPVkuQ85nCKZyViWurfIsk',
          },
          {
            from: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            to: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: '_20HX5leIjjgR3V9OZp7ZZToY3GCOMl88ypvEwns8_o',
          },
          {
            from: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            to: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: '3G63JMOJOzXGAJWhbTon7Q0lzcfEk7ltvhHFqzciAh4',
          },
          {
            from: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            to: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: '1j6s_RKmxus6xz2zQQOwCeeUERASCxZZjSSrQvlzNic',
          },
          {
            from: '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
            to: 'uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk',
            qty: 1000000,
            txID: 'sA4OIInIDufIFOwy4naKLq_pFe0lRXXYjcxKFBDUMwA',
          },
        ],
      },
    };

    const deployL1 = await warp.deploy({
      wallet: wallet1.jwk,
      initState: JSON.stringify(initialStateL1),
      src: contractSrcL1,
    });

    const deploySEQ = await warp.deploy({
      wallet: wallet1.jwk,
      initState: JSON.stringify({
        ...initialStateSEQ,
        balances: {
          uf_FqRvLqjnFMc8ZzGkF4qWKuNmUIQcYP0tPlCGORQk: 10000000000,
          '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4': 10000000000,
        },
        mint_contract: deployL1.contractTxId,
      }),
      evaluationManifest: {
        evaluationOptions: {
          sourceType: SourceType.WARP_SEQUENCER,
          internalWrites: true,
          unsafeClient: 'skip',
        },
      },
      src: contractSrcSEQ,
    });
    console.log(`L1 contractTxId ${deployL1.contractTxId}`);
    console.log(`SEQ contractTxId ${deploySEQ.contractTxId}`);

    execSync(
      `(cd ../app && npm i && VITE_CONTRACT_L1=${deployL1.contractTxId} VITE_CONTRACT_SEQ=${deploySEQ.contractTxId} VITE_LOCAL=true npm run dev)`,
      {
        encoding: 'utf8',
        stdio: 'inherit',
      }
    );
  } catch (e) {
    console.error(
      'Could not deploy contracts. Make sure arlocal is running (npx arlocal)'
    );
  }
}
deploy(process.argv[2]).catch(console.log);

function getBalances(state) {
  return compose(
    fromPairs,
    map(([k, v]) => [k, new BigNumber(v).integerValue()]),
    toPairs,
    prop('balances')
  )(state);
}
