import Async from "hyper-async";
const { of, fromPromise } = Async;

// this shoud query the L1 contract for a transaction with a tx
export function mint({ readContractState }) {
  console.log("ENTERED");
  return (state, action) => {
    console.log("RETURN", state.mint_contract);
    return of(state.mint_contract)
      .chain(fromPromise(readContractState))
      .map((mintState) => ({
        state,
        mintState,
      }))
      .fork(
        (e) => {
          console.log("Error", e);
          return e;
        },
        ({ state, mintState }) => {
          console.log("Resolved", state);
          return { state };
        }
      );
  };
}
