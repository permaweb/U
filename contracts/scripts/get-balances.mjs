import { readFileSync } from 'fs';
import path from 'path';
import { fromPairs } from 'ramda';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getBalances() {
  const filePath = path.join(__dirname, 'ids.txt');
  const ids = readFileSync(filePath, 'utf8').split('\n');
  const amount = 1;
  const pairs = ids.map((id) => [id, amount]);
  const balances = fromPairs(pairs);
  return balances;
}
