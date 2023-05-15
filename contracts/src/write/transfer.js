import Async from 'hyper-async';
const { of, fromPromise } = Async;
import { isInteger, roundDown, ceAsync, getBalance } from '../util.js';

/**
 * @description Transfers RebAR tokens to another address.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} state
 */
export function transfer({ kv }) {
  return async (state, action) => {
    return of(action.caller)
      .chain(ceAsync(!action.input?.target, 'Please specify a target.'))
      .chain(
        ceAsync(
          action.input?.target === action.caller,
          'Target cannot be caller.'
        )
      )
      .chain(ceAsync(!isInteger(action.input?.qty), 'qty must be an integer.'))
      .chain(
        ceAsync(
          roundDown(action.input?.qty) < 1,
          'Invalid token transfer. qty must be an integer greater than 0.'
        )
      )
      .chain((caller) => fromPromise(getBalance)(caller, kv))
      .chain((balance) =>
        ceAsync(
          (balance || 0) < roundDown(action.input?.qty),
          'Not enough tokens for transfer.'
        )(balance)
      )
      .chain((balance) =>
        fromPromise(getTargetBalance)(action.input.target, balance, kv)
      )
      .chain(({ balance, targetBalance }) =>
        fromPromise(updateBalances)(
          action.caller,
          action.input.target,
          balance,
          targetBalance,
          roundDown(action.input.qty),
          kv
        )
      )
      .fork(
        (error) => {
          throw new ContractError(error || 'An error occurred.');
        },
        () => {
          return { state };
        }
      );
  };
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {*} target
 * @param {*} balance
 * @param {*} kv
 */
const getTargetBalance = async (target, balance, kv) => ({
  balance,
  targetBalance: (await kv.get(target)) || 0,
});

/**
 *
 *
 * @author @jshaw-ar
 * @param {*} caller
 * @param {*} target
 * @param {*} balance
 * @param {*} targetBalance
 * @param {*} qty
 * @param {*} kv
 */
const updateBalances = async (
  caller,
  target,
  balance,
  targetBalance,
  qty,
  kv
) => {
  await kv.put(caller, balance - qty);
  await kv.put(target, targetBalance + qty);
  return {
    balance1: await kv.get(caller),
    balance2: await kv.get(target),
  };
};
