import { readFileSync } from 'fs';
import path from 'path';
import { WarpFactory } from 'warp-contracts/mjs';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function read(contractId) {
  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
  const warp = WarpFactory.forLocal();
  const filePath = path.join(__dirname, 'wallets.json');
  const wallets = JSON.parse(readFileSync(filePath, 'utf8'));

  const fiveHundoWallets = wallets.slice(0, 300).map((w) => w.address);
  const connected = warp
    .contract(contractId)
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
      useKVStorage: true,
      useConstructor: true,
    })
    .connect(jwk);
  const state = (await connected.readState()).cachedValue.state;
  console.log('State', JSON.stringify({ state }));
  const balances = (
    await connected.getStorageValues([
      '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
    ])
  ).cachedValue;

  const obj = Object.fromEntries(balances);
  console.log('Balances', obj);
}
read(process.argv[2]).catch(console.log);
