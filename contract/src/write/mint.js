import { of, fromNullable } from "../hyper-either.js";

export const mint = (state, action) => {
  return of({ state, action })
    .chain(fromNullable)
    .fold(
      () => {
        throw new ContractError("An error occured.");
      },
      ({ state, action }) => {
        const qty = Math.floor(parseInt(SmartWeave.transaction.reward) / 1e6);
        // Set balance to 0 if it doesn't exist
        if (!state.balances[action.caller]) state.balances[action.caller] = 0;

        state.balances[action.caller] += qty;
        return { state };
      }
    );
};
