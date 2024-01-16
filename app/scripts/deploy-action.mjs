import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import Arweave from 'arweave';
import Irys from '@irys/sdk';

const ANT = 'tudrGap6uMQ80zdFZsjAUkSp4Ea8YYsaKgskewqNWSU'; // u.arweave.dev
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

// const jwk = JSON.parse(fs.readFileSync('../wallet.json', 'utf-8'))
const jwk = JSON.parse(
  Buffer.from(process.env.WALLET, 'base64').toString('utf-8')
);

const irys = new Irys({ url: 'https://node2.bundlr.network', token: 'arweave', key: jwk });

const warp = WarpFactory.custom(arweave, defaultCacheOptions, 'mainnet')
  .useArweaveGateway()
  .build();

const contract = warp.contract(ANT).connect(jwk);
// upload folder
const result = await irys.uploadFolder('./dist', {
  indexFile: 'index.html',
});

// update ANT

await contract.writeInteraction({
  function: 'setRecord',
  subDomain: '@',
  transactionId: result.id,
});

console.log('Deployed U, please wait 20 - 30 minutes for ArNS to update!');
