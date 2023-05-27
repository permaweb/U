import Arweave from 'arweave'
import fs from 'fs'
import { omit, map } from 'ramda'

const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })

const src = fs.readFileSync('./dist/contract-SEQ.js', 'utf-8')
const initState = JSON.parse(fs.readFileSync('./launch/seq/state.json', 'utf-8'))
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

  const srcTx = await arweave.createTransaction({ data: src })
  srcTx.addTag('Content-Type', 'application/javascript')
  await arweave.transactions.sign(srcTx, jwk)
  await arweave.transactions.post(srcTx)
  console.log('srcId', srcTx.id)

  const contractTx = await arweave.createTransaction({ data: JSON.stringify({ ...initState, balances }) })
  contractTx.addTag('Content-Type', 'application/json')
  contractTx.addTag('App-Name', 'SmartWeaveContract')
  contractTx.addTag('App-Version', '0.3.0')
  contractTx.addTag('Contract-Src', srcTx.id)
  contractTx.addTag('Contract-Manifest', JSON.stringify({
    evaluationOptions: {
      sourceType: 'redstone-sequencer',
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip'
    }
  }))
  await arweave.transactions.sign(contractTx, jwk)
  await arweave.transactions.post(contractTx)
  console.log('contractTx', contractTx.id)

}

main();