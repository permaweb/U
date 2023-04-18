/**
 * @description Same as ContractAssert with a passthrough
 *
 * @author @jshaw-ar
 * @param {*} flag What your conditional check is
 * @param {*} message Error message if conditional is true
 * @param {*} p The payload to pass through the func
 * @return {*} p
 */
export const ca = (flag, message) => (p) => flag ? Left(message) : Right(p);
