import { WarpFactory, SourceType } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { writeFileSync, readFileSync } from 'fs';

async function go(folder) {
  const warp = WarpFactory.forLocal().use(new DeployPlugin());
  const w = await warp.generateWallet();
  const contractSrcL1 = readFileSync(`${folder}/contract-L1.js`, 'utf8');
  const stateFromFileL1 = JSON.parse(
    readFileSync(`${folder}/initial-state-L1.json`, 'utf8')
  );
  const contractSrcSEQ = readFileSync(`${folder}/contract-SEQ.js`, 'utf8');
  const stateFromFileSEQ = JSON.parse(
    readFileSync(`${folder}/initial-state-SEQ.json`, 'utf8')
  );

  const initialStateL1 = {
    ...stateFromFileL1,
    ...{
      owner: w.address,
    },
  };

  const initialStateSEQ = {
    ...stateFromFileSEQ,
    ...{
      owner: process.env.WALLET_ADDRESS,
    },
  };

  const deployL1 = await warp.deploy({
    wallet: w.jwk,
    initState: JSON.stringify(initialStateL1),
    src: contractSrcL1,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.ARWEAVE,
        unsafeClient: 'skip',
        internalWrites: false,
      },
    },
  });

  const deploySEQ = await warp.deploy({
    wallet: w.jwk,
    initState: JSON.stringify({
      ...initialStateSEQ,
      mint_contract: deployL1.contractTxId,
    }),
    src: contractSrcSEQ,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.WARP_SEQUENCER,
        internalWrites: true,
        unsafeClient: 'skip',
        useKVStorage: true,
      },
    },
  });
  console.log(`L1 contractTxId ${deployL1.contractTxId}`);
  console.log(`SEQ contractTxId ${deploySEQ.contractTxId}`);
  console.time('Wallets');
  console.timeLog('Wallets');
  const wallets = [];
  for (let index = 0; index < 10000; index++) {
    const wallet = await warp.generateWallet();
    wallets.push({ jwk: wallet.jwk, address: wallet.address });
    console.log(index);
  }

  console.timeEnd('Wallets');
  console.log(`${wallets.length} wallets created`);
  writeFileSync('./perf/wallets.json', JSON.stringify(wallets));
}
go(process.argv[2]).catch(console.log);
