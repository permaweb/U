import Async from "hyper-async";
const { of, fromPromise } = Async;

// this shoud query the L1 contract for a transaction with a tx
export function mint({ readContractState }) {
  return (state, action) => {
    return (
      of(state.mint_contract)
        .chain(fromPromise(readContractState))
        // floor reward (integer), check if it's above 0
        .map((input) => {
          console.log("REWARD", SmartWeave.transaction.reward);
          console.log("HEIGHT", SmartWeave.block.height);
          console.log("CONTARCT", state.mint_contract);
          return input;
        })
        .fork(
          (e) => {
            console.log("Error", e);
            return e;
          },
          (input) => {
            console.log("Resolved", input);
            return { input };
          }
        )
    );
  };
}
