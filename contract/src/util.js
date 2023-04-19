import BigNumber from "bignumber.js";
import { Left, Right } from "./hyper-either.js";
import { over, ifElse, identity, lensProp, always, isNil } from "ramda";

/**
 * @description Contract Error
 *
 * @author @jshaw-ar
 * @param {*} flag What your conditional check is
 * @param {*} message Error message if conditional is true
 * @param {*} p The payload to pass through the func
 * @return {*} p
 */
export const ce = (flag, message) => (p) => flag ? Left(message) : Right(p);

/**
 * Converts qty to a number (eg. converts 10.0 => 10)
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
export function qtyToNumber({ state, action }) {
  return {
    state,
    action: {
      ...action,
      input: {
        ...action.input,
        qty: new BigNumber(action.input?.qty).toNumber(),
      },
    },
  };
}

/**
 *
 *
 * @author Tom Wilson
 * @export
 * @param {*} { state, action }
 * @return {*}
 */
export function setCallerBalance({ state, action }) {
  return {
    state: {
      ...state,
      balances: over(
        lensProp(action.caller),
        ifElse(isNil, always(0), identity),
        state.balances
      ),
    },
    action,
  };
}
