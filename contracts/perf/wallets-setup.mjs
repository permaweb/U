import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function go() {
  const filePath = path.join(__dirname, 'wallets.json');
  const wallets = JSON.parse(readFileSync(filePath, 'utf8'));

  for (let i = 0; i < wallets.length; i++) {
    await fetch(
      `http://localhost:1984/mint/${wallets[i].address}/10000000000000000`
    );
    console.log(`${wallets[i].address} completed`);
  }
}
go().catch(console.log);

const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`);
}
