import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy'
import { SourceType, WarpFactory, defaultCacheOptions } from 'warp-contracts'
import fs from 'fs'

const warp = WarpFactory.forMainnet().use(new DeployPlugin())
const src = fs.readFileSync('./dist/contract-SEQ.js', 'utf-8')
const initState = fs.readFileSync('./launch/seq/state.json', 'utf-8')
const jwk = JSON.parse(fs.readFileSync('../wallet.json', 'utf-8'))

async function main() {
  const result = await warp.deploy({
    src,
    initState,
    wallet: new ArweaveSigner(jwk),
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.BOTH,
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip'
      }
    }
    //,disableBundling: true,

  })
  console.log(result)
}

main()