import { compose, toPairs, filter, fromPairs } from "ramda";

import { Left, Right, of, fromNullable } from "../hyper-either.js";

export const mint = (state, action) => {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ca(!state.mints[action.input.tx], "Mint request does not exist."))
    .chain(
      ca(
        SmartWeave.transaction.reward !== state.mints[action.input.tx].amount,
        `The reward must equal the request amount.`
      )
    )
    .chain(
      ca(
        SmartWeave.block.height <= state.mints[action.input.tx].height,
        "Mint request expired."
      )
    )
    .chain(
      ca(
        action.caller !== state.mints[action.input.tx].addr,
        `Caller not authorized.`
      )
    )
    .fold(
      (message) => {
        throw new ContractError(message);
      },
      ({ state, action }) => {
        const mint = state.mints[action.input.tx];

        // // Set balance to 0 if it doesn't exist
        if (!state.balances[mint.addr]) state.balances[mint.addr] = 0;

        // mint pc
        state.balances[mint.addr] += mint.amount;
        if (!Number.isInteger(state.balances[mint.addr]))
          throw new ContractError(
            `There was an error minting your tokens. ${JSON.stringify({
              state,
              action,
            })}`
          );
        return {
          state: {
            ...state,
            mints: compose(
              fromPairs,
              filter(([tx]) => tx !== action.input.tx),
              toPairs
            )(state.mints),
          },
        };
      }
    );
};

/**
 * @description Same as ContractAssert with a passthrough
 *
 * @author @jshaw-ar
 * @param {*} flag What your conditional check is
 * @param {*} message Error message if conditional is true
 * @param {*} p The payload to pass through the func
 * @return {*} p
 */
const ca = (flag, message) => (p) => flag ? Left(message) : Right(p);
