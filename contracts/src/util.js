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
  __,
} from "ramda";

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
 * @description Converts qty to a number (eg. converts 10.0 => 10)
 *
 * @author @jshaw-ar
 * @param {{ state, action }}
 * @return {{ state, action }}
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
 * @description Sets caller balance to 0 if it does not exist
 *
 * @author Tom Wilson
 * @export
 * @param {{ state, action }}
 * @return {{ state, action }}
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
 * @description Sets target balance to 0 if it does not exist
 *
 * @author Tom Wilson
 * @export
 * @param {{ state, action }}
 * @return {{ state, action }}
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
 * @description Subtracts qty from caller balance
 *
 * @author @jshaw-ar
 * @param {{ state, action }}
 * @return {{ state, action }}
 */
export function subtractCallerBalance({ state, action }) {
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
 * @description Uses BigNumber to check if value is an integer.
 *
 * @author @jshaw-ar
 * @export
 * @param {number} v
 * @return {number}
 */
export function isInteger(v) {
  return new BigNumber(v).isInteger();
}
