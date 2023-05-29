import Arweave from 'arweave'
import fs from 'fs'

const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })

const src = fs.readFileSync('./dist/contract-L1.js', 'utf-8')
const initState = fs.readFileSync('./launch/l1/state.json', 'utf-8')
const jwk = JSON.parse(fs.readFileSync('../wallet.json', 'utf-8'))

async function main() {
  const reward = await fetch(`https://arweave.net/price/1`).then(r => r.text())
  const x = Math.floor(Number(reward) * 1.1)
  const srcTx = await arweave.createTransaction({ data: src, reward: x.toString() })
  srcTx.addTag('Content-Type', 'application/javascript')
  await arweave.transactions.sign(srcTx, jwk)
  await arweave.transactions.post(srcTx)
  console.log('srcId', srcTx.id)

  // deploy contract
  const contractTx = await arweave.createTransaction({ data: initState })
  contractTx.addTag('Content-Type', 'application/json')
  contractTx.addTag('App-Name', 'SmartWeaveContract')
  contractTx.addTag('App-Version', '0.3.0')
  contractTx.addTag('Contract-Src', srcTx.id)
  contractTx.addTag('Contract-Manifest', JSON.stringify({
    evaluationOptions: {
      sourceType: 'arweave',
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