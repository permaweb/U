// import { of, fromNullable } from "../hyper-either.js";
// import { setCallerBalance } from "../util.js";
// import { __, identity, assoc } from "ramda";
// import Async from "crocks";
// const { of, fromPromise } = Async;

export async function mint({ readContractState }) {
  // const readState = fromPromise(readContractState);
  throw new ContractError(JSON.stringify({ LETS_GO: "LETS GO" }));
  // return (state, action) =>
  //   of(path(["input", "contractId"], action))
  //     .chain(readState)
  //     .map((state) => {
  //       throw new ContractError(JSON.stringify(state));
  //     });
}
