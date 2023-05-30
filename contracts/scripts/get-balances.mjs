import BigNumber from 'bignumber.js';
import { readFileSync } from 'fs';
import path from 'path';
import { compose, prop, fromPairs, toPairs, map } from 'ramda';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// node1: OXcT1sVRSA5eGwt2k6Yuz8-3e3g9WJi5uSE99CWqsBs
// node2: ZE0N-8P9gXkhtK-07PQu9d8me5tGDxa_i4Mee5RzVYg
export async function getBalances() {
  const BAR = 'VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA';
  const DRE = 'https://cache-2.permaweb.tools';
  const BAR_STATE = await fetch(`${DRE}/contract/?id=${BAR}`)
    .then((r) => r.json())
    .then(prop('state'));
  const barBalances = getBalances1(BAR_STATE);

  const node1 = barBalances['OXcT1sVRSA5eGwt2k6Yuz8-3e3g9WJi5uSE99CWqsBs'];
  const node2 = barBalances['ZE0N-8P9gXkhtK-07PQu9d8me5tGDxa_i4Mee5RzVYg'];

  const balance = Math.floor(node1 + node2);
  const filePath = path.join(__dirname, 'ids.txt');
  const ids = readFileSync(filePath, 'utf8').split('\n');

  // Divide balances from 2 nodes by ids length
  const amount = Math.floor(balance / ids.length);
  const pairs = ids.map((id) => [id, amount]);
  const balances = fromPairs(pairs);
  return balances;
}

function getBalances1(state) {
  return compose(
    fromPairs,
    map(([k, v]) => [
      k,
      new BigNumber(v).integerValue(BigNumber.ROUND_DOWN).toNumber(),
    ]),
    toPairs,
    prop('balances')
  )(state);
}
getBalances();
