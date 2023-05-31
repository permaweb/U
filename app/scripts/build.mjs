import { execSync } from 'child_process';

execSync(
  `(npm i && tsc && VITE_CONTRACT=vPaIJgl6bLf8V2Wy7aGbsPoUL3RkQ0srr0ChEm8wxvs vite build)`,
  {
    encoding: 'utf8',
    stdio: 'inherit',
  }
);
