import BigNumber from 'bignumber.js';
import { Left, Right } from './hyper-either.js';
import { Rejected, Resolved } from 'hyper-async';

/**
 * @description Contract Error (use with hyper-either)
 *
 * @author @jshaw-ar
 * @param {Boolean} flag What your conditional check is
 * @param {string} message Error message if conditional is true
 * @param {{state, action}} p The payload to pass through the func
 * @return {{state, action}} p
 */
export const ce = (flag, message) => (p) => flag ? Left(message) : Right(p);

/**
 * @description Contract Error Async (use with hyper-async)
 *
 * @author @jshaw-ar
 * @param {Boolean} flag What your conditional check is
 * @param {string} message Error message if conditional is true
 * @param {{state, action}} p The payload to pass through the func
 * @return {{state, action}} p
 */
export const ceAsync = (flag, message) => (p) =>
  flag ? Rejected(message) : Resolved(p);

/**
 * @description Uses BigNumber to check if value is an integer.
 *
 * @author @jshaw-ar
 * @export
 * @param {number} v
 * @return {boolean}
 */
export function isInteger(v) {
  return new BigNumber(v).isInteger();
}

/**
 * @description Uses bignumber.js to round down.
 *
 * @author @jshaw-ar
 * @export
 * @param {number} v
 * @return {number}
 */
export function roundDown(v) {
  return new BigNumber(v).integerValue(BigNumber.ROUND_DOWN).toNumber();
}

/**
 * @description Removes expired from array.
 *
 * @author @jshaw-ar
 * @export
 * @param {Array} queue
 * @param {number} height
 * @return {Array}
 */
export const removeExpired = (queue, height) =>
  queue.filter((request) => request?.expires > height);

/**
 *
 *
 * @author @jshaw-ar
 * @param {*} target
 * @param {*} balance
 * @param {*} kv
 */
export const getTargetBalance = async (target, balance, kv) => ({
  balance,
  targetBalance: (await kv.get(target)) || 0,
});

/**
 * @description Adds the balance based on a
 *
 * @author @jshaw-ar
 * @param {*} state
 * @param {*} action
 * @param {*} kv
 * @return {*}
 */
export const addClaimBalanceTo = async (state, action, kv) => {
  const indexToRemove = state.claimable.findIndex(
    (claim) => claim.txID === action.input.txID
  );
  const claim = state.claimable[indexToRemove];
  const balance = (await kv.get(claim.to)) || 0;
  await kv.put(claim.to, balance + claim.qty);
  return indexToRemove;
};

/**
 * @description Adds the balance based on a
 *
 * @author @jshaw-ar
 * @param {*} state
 * @param {*} action
 * @param {*} kv
 * @return {*}
 */
export const addClaimBalanceFrom = async (state, action, kv) => {
  const indexToRemove = state.claimable.findIndex(
    (claim) => claim.txID === action.input.tx
  );
  const claim = state.claimable[indexToRemove];
  const balance = (await kv.get(claim.from)) || 0;
  await kv.put(claim.from, balance + claim.qty);
  return indexToRemove;
};

/**
 * @description Gets the balance from the key value store
 *
 * @author @jshaw-ar
 * @param {string} caller
 * @param {*} kv (SmartWeave object)
 * @return {number} balance
 */
export const getBalance = async (caller, kv) => {
  return kv.get(caller);
};
