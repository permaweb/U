import { WarpFactory } from 'warp-contracts';

import fs from 'fs';

async function read(contractId) {
  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
  const warp = WarpFactory.forLocal();

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
  console.log('State / Balances', JSON.stringify({ state, balance }));
}
read(process.argv[2], process.argv[3]).catch(console.log);
