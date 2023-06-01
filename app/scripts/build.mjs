import { execSync } from 'child_process';

execSync(
  `(npm i && tsc && VITE_CONTRACT=rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk vite build)`,
  {
    encoding: 'utf8',
    stdio: 'inherit',
  }
);
