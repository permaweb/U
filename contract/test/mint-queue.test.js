import { test } from "uvu";
import * as assert from "uvu/assert";

import { expireStaleRequests } from "../src/write/mint-mgr.js";

const state = {
  mints: {
    "64C_stpAbjBEVHc1GWA8Lc0iB0q0KrKPar3hzts44cI": {
      amount: 1 * 1e12,
      fee: 1,
      addr: "1gd5fUVEcCqhDibQv8JKJ9Q9qZReLcJbvh03c17ZzZ0",
      height: 1000,
    },
    CGUfdWJ5OB8rwbx_eJESdb4byTZjg3VbDsjLsFYCOL0: {
      amount: 1 * 1e12,
      fee: 1,
      addr: "4KabQSkHSg3i-CwdILGjF9MrLhNLZhkHgADMv4Dv2Og",
      height: 1002,
    },
    LUnyk7pSPmskcCoFQML3IKp1lf_lfWd1NFAcZIKOCBI: {
      amount: 1 * 1e12,
      fee: 1,
      addr: "6Ki_8bQ5U_5kuPK2OGC4ncGPbmJDYJuhVSMuQLC3a-Y",
      height: 1003,
    },
    "cSYLbUfbGi8H6Xx5l9jSAKn93-QsFUW-QklnCPbIcKw": {
      amount: 1 * 1e12,
      fee: 1,
      addr: "6Z-ifqgVi1jOwMvSNwKWs6ewUEQ0gU9eo4aHYC3rN1M",
      height: 1004,
    },
  },
};

test("remove expired mint requests", () => {
  globalThis.SmartWeave = {
    block: {
      height: 1003,
    },
  };
  state.mints = expireStaleRequests(state.mints);
  assert.equal(Object.values(state.mints).length, 2);
});

test.run();
