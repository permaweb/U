import { of } from "../hyper-either.js";
import { __, identity, assoc } from "ramda";
import { ce, filterExpired, isInteger } from "../util.js";

export function createMint({ reward, height, tx }) {
  return (state, action) =>
    of({ state, action, tx, reward, height })
      .chain(
        ce(!isInteger(reward / 1e6), "(reward / 1e6) must be an integer > 0.")
      )
      .map(createRequest)
      .map(assoc("state", __, {}))
      .fold((msg) => {
        throw new ContractError(msg || "An error occurred.");
      }, identity);
}

const createRequest = ({ state, action, tx, reward, height }) => {
  return {
    ...state,
    requests: {
      [tx]: {
        target: action.caller,
        qty: reward / 1e6,
        expires: height + 720,
      },
      ...filterExpired(state.requests),
    },
  };
};
