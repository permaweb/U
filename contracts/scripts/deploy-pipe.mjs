import Async from 'hyper-async';
import {
  deployL1,
  deploySEQ,
  setup,
  writeIds,
} from './deploy-contract-prod.mjs';
const { fromPromise, of } = Async;

const pipe = (folder) =>
  of(folder)
    .chain(fromPromise(setup))
    .chain(fromPromise(deployL1))
    .chain(fromPromise(deploySEQ))
    .chain(fromPromise(writeIds))
    .fork(
      (e) => {
        console.log('There was an error.');
        console.log(e.message);
        process.exit(1);
      },
      (input) => {
        console.log(`Successfully deployed contracts`, input);
      }
    );

pipe(process.argv[2]);
