import {
  compose,
  pipe,
  toPairs,
  filter,
  fromPairs,
  append,
  take,
  sortWith,
  descend,
  path,
  over,
  lensProp,
  ascend,
} from "ramda";

import { Left, Right, of, fromNullable } from "../hyper-either.js";
const HEIGHTS = 5;

export function mintRequest(state, action) {
  ContractAssert(
    Number.isInteger(action.input.amount),
    "amount MUST be Integer!"
  );
  ContractAssert(Number.isInteger(action.input.fee), "fee MUST be Integer!");
  ContractAssert(
    action.input.amount <= 1 * 1e12,
    "amount must be less than or equal to 1 AR"
  );
  ContractAssert(action.input.fee > 0, "fee must be greater than 0");

  state = over(
    lensProp("mints"),
    compose(
      fromPairs,
      take(state.mintQueueSize),
      sortWith([descend(path([1, "fee"])), ascend(path([1, "height"]))]),
      append([
        SmartWeave.transaction.id,
        {
          amount: action.input.amount,
          fee: action.input.fee,
          addr: action.caller,
          height: SmartWeave.block.height + HEIGHTS,
        },
      ]),
      toPairs
    ),
    state
  );

  if (!state.mints[SmartWeave.transaction.id]) {
    return { result: "Could not add to queue!" };
  }

  return { state };
}

/**
 *
 *
 * @param {Record<string, {amount: number, fee: number, addr: string, height: number}>}
 * @returns {Record<string, {amount: number, fee: number, addr: string, height: number}>}
 */
export function expireStaleRequests(mints) {
  return compose(
    fromPairs,
    filter(([_, req]) => req.height >= SmartWeave.block.height),
    toPairs
  )(mints);
}

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
