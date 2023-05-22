import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../contracts.json');
const contracts = JSON.parse(readFileSync(filePath, 'utf8'));

execSync(
  `(npm i && tsc && VITE_CONTRACT_L1=${contracts.l1} VITE_CONTRACT_SEQ=${contracts.l2} vite build)`,
  {
    encoding: 'utf8',
    stdio: 'inherit',
  }
);
