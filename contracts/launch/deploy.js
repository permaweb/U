import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy'
import { SourceType, WarpFactory, defaultCacheOptions } from 'warp-contracts'
import fs from 'fs'

import { omit, map } from 'ramda'

const warp = WarpFactory.forMainnet(defaultCacheOptions, true).use(new DeployPlugin())
const src = fs.readFileSync('./dist/contract.js', 'utf-8')
const initState = JSON.parse(fs.readFileSync('./launch/state.json', 'utf-8'))
const jwk = JSON.parse(fs.readFileSync('../wallet.json', 'utf-8'))

async function main() {
  const balances = await fetch('https://cache-2.permaweb.tools/contract/?id=VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA')
    .then(res => res.json())
    .then(result => result.state.balances)
    .then(map(v => Math.floor(v)))
    .then(omit([
      'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI',
      '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4',
      'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw',
      '89tR0-C1m3_sCWCoVCChg4gFYKdiH5_ZDyZpdJ2DDRw'
    ]))

  const result = await warp.deploy({
    src,
    initState: JSON.stringify({ ...initState, balances }),
    //wallet: new ArweaveSigner(jwk),
    wallet: jwk,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.BOTH,
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip'
      }
    }
  }, {
    disabledBundling: true
  })
  console.log(result)
}

main()