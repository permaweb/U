import Bundlr from '@bundlr-network/client';
import { WarpFactory, defaultCacheOptions } from 'warp-contracts';

// const jwk = JSON.parse(fs.readFileSync('../wallet.json', 'utf-8'))
const jwk = JSON.parse(
  Buffer.from(process.env.WALLET, 'base64').toString('utf-8')
);

const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', jwk);
const warp = WarpFactory.custom(arweave, defaultCacheOptions, 'mainnet')
  .useArweaveGateway()
  .build();

const contract = warp.contract(ANT).connect(jwk);
// upload folder
const result = await bundlr.uploadFolder('./dist', {
  indexFile: 'index.html',
});

// update ANT

await contract.writeInteraction({
  function: 'setRecord',
  subDomain: '@',
  transactionId: result.id,
});

console.log(
  'Deployed RebAR, please wait 20 - 30 minutes for ArNS to update!',
  result.id
);
