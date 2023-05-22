import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WarpFactory, SourceType } from 'warp-contracts/mjs';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function go() {
  let count = 0;
  const filePath = path.join(__dirname, 'wallets.json');
  const wallets = JSON.parse(readFileSync(filePath, 'utf8'));
  const warp = WarpFactory.forLocal().use(new DeployPlugin());

  const prefix = `./dist/`;
  const contractSrcL1 = readFileSync(`${prefix}contract-L1.js`, 'utf8');
  const initialStateL1 = JSON.parse(
    readFileSync(`${prefix}initial-state-L1.json`, 'utf8')
  );
  const contractSrcSEQ = readFileSync(`${prefix}contract-SEQ.js`, 'utf8');
  const initialStateSEQ = JSON.parse(
    readFileSync(`${prefix}initial-state-SEQ.json`, 'utf8')
  );

  // Update initial state giving the wallet 100
  const stateL1 = {
    ...initialStateL1,
    ...{
      owner: 'owner',
      requests: [
        {
          tx: '<expired>',
          target: '<jshaw>',
          qty: 100,
          expires: 0,
        },
      ],
    },
  };

  const stateSEQ = {
    ...initialStateSEQ,
    ...{
      owner: 'owner',
      balances: {},
      pile: { processed: 10, processed_expired: -1 },
    },
  };

  // Deploy contract
  const contractL1 = await warp.deploy({
    wallet: wallets[0].jwk,
    initState: JSON.stringify(stateL1),
    src: contractSrcL1,
  });

  // Deploy contract
  const contractSEQ = await warp.deploy({
    wallet: wallets[0].jwk,
    initState: JSON.stringify({
      ...stateSEQ,
      // Set the mint contract to the L1 contract tx.
      mint_contract: contractL1.contractTxId,
    }),
    src: contractSrcSEQ,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.WARP_SEQUENCER,
        internalWrites: true,
        unsafeClient: 'skip',
        useKVStorage: true,
        useConstructor: true,
      },
    },
  });

  console.time('perf');
  // Some code
  const connectedL2 = warp
    .contract(contractSEQ.contractTxId)
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
      useKVStorage: true,
      useConstructor: true,
    })
    .connect(wallets[0].jwk);
  for (let i = 0; i < 2; i++) {
    await connectedL2.writeInteraction({
      function: 'mint',
    });
    for (let i = 0; i < wallets.length; i++) {
      const connectedL1 = warp
        .contract(contractL1.contractTxId)
        .setEvaluationOptions({ internalWrites: true, mineArLocalBlocks: true })
        .connect(wallets[i].jwk);
      await connectedL1.writeInteraction(
        { function: 'create-mint' },
        { reward: '1000000' }
      );
      count++;
      console.log('Processed', count);
    }
  }
  console.timeLog('perf');

  await connectedL2.writeInteraction({
    function: 'mint',
  });

  console.timeEnd('perf');
  console.log('END');
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(
      'Memory Usage',
      `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
}
go().catch(console.log);
