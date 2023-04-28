import { of } from "../hyper-either.js";
import { __, identity, assoc } from "ramda";
import { roundDown } from "../util.js";

export function createMint({ reward, height, tx }) {
  return (state, action) => {
    return of({ state, action, tx, reward, height })
      .map(createRequest)
      .map(assoc("state", __, {}))
      .fold((msg) => {
        throw new ContractError(msg || "An error occurred.");
      }, identity);
  };
}

const createRequest = ({ state, action, tx, reward, height }) => {
  return {
    ...state,
    requests: {
      [SmartWeave.transaction.id]: {
        target: action.caller,
        qty: roundDown(SmartWeave.transaction.reward / 1e6),
        expires: SmartWeave.block.height + 720,
      },
      ...state.requests,
    },
  };
};
