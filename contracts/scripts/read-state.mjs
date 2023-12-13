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
      remoteStateSyncSource: `https://dre-u.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .connect(jwk);
  const state = (await connected.readState()).cachedValue.state;

  console.log('State / Balances', JSON.stringify({ state }));
}
read(process.argv[2], process.argv[3]).catch(console.log);
