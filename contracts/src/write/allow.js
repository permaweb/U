import Async from 'hyper-async';
const { of, fromPromise } = Async;
import { ceAsync, getBalance, isInteger, roundDown } from '../util.js';

/**
 * @description Creates a transfer that can be claimed.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*} {state}
 */
export function allow({ kv, transaction }) {
  return (state, action) => {
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
          'Not enough tokens for allow.'
        )(balance)
      )
      .chain((balance) =>
        fromPromise(subtractBalance)(
          action.caller,
          balance,
          roundDown(action.input.qty),
          kv
        )
      )
      .map((qty) => {
        state.claimable.push({
          from: action.caller,
          to: action.input.target,
          qty,
          txID: transaction.id,
        });
      })
      .fork(
        (msg) => {
          throw new ContractError(msg || 'An error occurred.');
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
 * @param {*} caller
 * @param {*} balance
 * @param {*} qty
 */
const subtractBalance = async (caller, balance, qty, kv) => {
  await kv.put(caller, balance - qty);
  return qty;
};
