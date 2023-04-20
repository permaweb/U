import BigNumber from "bignumber.js";
import { Left, Right } from "./hyper-either.js";
import {
  over,
  ifElse,
  identity,
  lensProp,
  always,
  isNil,
  add,
  subtract,
} from "ramda";

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
 * Sets caller balance to 0 if it does not exist
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

/**
 * Sets target balance to 0 if it does not exist
 *
 * @author Tom Wilson
 * @export
 * @param {*} { state, action }
 * @return {*}
 */
export function setTargetBalance({ state, action }) {
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

/**
 * Subtracts qty from caller balance
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
export function subtractCallerBalance({ state, action }) {
  return {
    state: {
      ...state,
      balances: over(
        lensProp(action.caller),
        subtract(action.input.qty),
        state.balances
      ),
    },
    action,
  };
}

/**
 * Adds qty from caller balance
 *
 * @author @jshaw-ar
 * @param {*} { state, action }
 * @return {*}
 */
export function addTargetBalance({ state, action }) {
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

/**
 * Uses BigNumber to check if value is an integer.
 *
 * @author @jshaw-ar
 * @export
 * @param {*} v value
 * @return {*}
 */
export function isInteger(v) {
  return new BigNumber(v).isInteger();
}
