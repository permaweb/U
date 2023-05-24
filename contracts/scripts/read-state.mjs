import { WarpFactory } from 'warp-contracts';

import fs from 'fs';

async function read(contractId, address) {
  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
  const warp = WarpFactory.forMainnet();

  const connected = warp
    .contract(contractId)
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
      allowBigInt: true,
    })
    .connect(jwk);
  const state = (await connected.readState()).cachedValue.state;

  console.log('State', JSON.stringify({ state }));
}
read(process.argv[2], process.argv[3]).catch(console.log);
