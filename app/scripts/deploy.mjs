import Bundlr from '@bundlr-network/client';
import { readFileSync } from 'fs';

const jwk = JSON.parse(readFileSync(process.env.PATH_TO_WALLET, 'utf-8'));

const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', jwk);

// upload folder
const result = await bundlr.uploadFolder('./dist', {
  indexFile: 'index.html',
});

console.log('Result', result);
