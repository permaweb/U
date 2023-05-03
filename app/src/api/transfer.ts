import Async from 'hyper-async';
import { getWarpFactory, syncState } from './common';
const { of, fromPromise } = Async;
import BigNumber from 'bignumber.js';
import { StateSEQ } from './interface';
import {
  over,
  ifElse,
  identity,
  lensProp,
  always,
  isNil,
  add,
  subtract,
  __,
} from 'ramda';

export interface TransferInput {
  contractId: string;
  from: string;
  target: string;
  qty: number;
  state: StateSEQ;
}

export function transfer(input: TransferInput) {
  return of(input)
    .chain((input: TransferInput) => fromPromise(warpTransfer)(input))
    .map(setTargetBalance)
    .map(subtractCallerBalance)
    .map(addTargetBalance)
    .fork(
      (e: any) => {
        console.log(e);
        return { error: 'There was an error fetching the contract state' };
      },
      (output: {
        state: StateSEQ;
        action: { caller: string; input: { qty: number; target: string } };
      }) => {
        console.log('Transfer State', output.state);
        return { ...output.state };
      }
    );
}

const warpTransfer = async (input: TransferInput) => {
  const { contractId, qty, target, from } = input;
  const warp = getWarpFactory();

  if (!import.meta.env.VITE_LOCAL) await syncState(warp, contractId);
  const contract = warp
    .contract(contractId)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
    });
  const newQty = new BigNumber(qty * 1e6)
    .integerValue(BigNumber.ROUND_DOWN)
    .toNumber();
  const interaction = await contract.writeInteraction({
    function: 'transfer',
    target,
    qty: newQty,
  });

  return {
    state: { ...input.state },
    action: { caller: from, input: { target, qty: newQty } },
  };
};

/**
 * @description Sets target balance to 0 if it does not exist
 *
 * @author Tom Wilson
 * @export
 * @param {{ state, action }}
 * @return {{ state, action }}
 */
export function setTargetBalance(input: {
  state: StateSEQ;
  action: { caller: string; input: { qty: number; target: string } };
}) {
  const { state, action } = input;
  return {
    state: {
      ...state,
      balances: over(
        lensProp(action.input.target),
        ifElse(isNil, always(0), identity),
        state.balances
      ),
    },
    action,
  };
}

export function subtractCallerBalance(input: {
  state: StateSEQ;
  action: { caller: string; input: { qty: number; target: string } };
}) {
  const { state, action } = input;
  return {
    state: {
      ...state,
      balances: over(
        lensProp(action.caller),
        subtract(__, action.input.qty),
        state.balances
      ),
    },
    action,
  };
}

/**
 * @description Adds qty from caller balance
 *
 * @author @jshaw-ar
 * @param {{ state, action }}
 * @return {{ state, action }}
 */
export function addTargetBalance(input: {
  state: StateSEQ;
  action: { caller: string; input: { qty: number; target: string } };
}) {
  const { state, action } = input;
  return {
    state: {
      ...state,
      balances: over(
        lensProp(action.input.target),
        add(action.input.qty),
        state.balances
      ),
    },
    action,
  };
}
