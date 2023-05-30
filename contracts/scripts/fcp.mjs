import { WarpFactory, SourceType } from 'warp-contracts';

import fs from 'fs';

async function read(contractId, address) {
  const jwk = JSON.parse(
    fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  );
  const warp = WarpFactory.forMainnet();

  const connected = warp
    .contract(contractId)
    .setEvaluationOptions({
      sourceType: SourceType.BOTH,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .connect(jwk);
  const interaction1 = await connected.writeInteraction({
    function: 'allow',
    target: '9EIo8Qm0gPXIqMpzx8nrZ0YYDGaAnMWXhrPdvXIO0Fg',
    qty: 100,
  });

  console.log('Allow id', interaction1.originalTxId);
}
read(process.argv[2], process.argv[3]).catch(console.log);
