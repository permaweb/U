import { Left, Right } from "./hyper-either.js";

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
