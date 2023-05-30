import { execSync } from 'child_process';

execSync(
  `(npm i && tsc && VITE_CONTRACT=LL2_TB0RUgZnKP6QZ2M1kiUz0joKEHuGHXiXQYVhRsM vite build)`,
  {
    encoding: 'utf8',
    stdio: 'inherit',
  }
);
