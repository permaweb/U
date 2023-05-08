import BigNumber from 'bignumber.js';
import { Left, Right } from './hyper-either.js';
import { fromPairs, toPairs, pipe } from 'ramda';

/**
 * @description Contract Error
 *
 * @author @jshaw-ar
 * @param {Boolean} flag What your conditional check is
 * @param {string} message Error message if conditional is true
 * @param {{state, action}} p The payload to pass through the func
 * @return {{state, action}} p
 */
export const ce = (flag, message) => (p) => flag ? Left(message) : Right(p);

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
 * @description Removes expired and zero qty from array.
 *
 * @author @jshaw-ar
 * @export
 * @param {Array} requests
 * @param {number} height
 * @return {Array}
 */
export const filterInvalid = (requests, height) =>
  pipe(toPairs, (pairs) => removeExpired(pairs, height), fromPairs)(requests);

/**
 * @description Removes expired from array.
 *
 * @author @jshaw-ar
 * @export
 * @param {Array} requests
 * @param {number} height
 * @return {Array} pairs
 */
export const removeExpired = (pairs, height) =>
  pairs.filter((request) => request[1].expires > height);
