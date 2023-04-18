import { test } from "uvu";
import * as assert from "uvu/assert";
import { over, lensProp, assoc } from "ramda";

import { mintRequest } from "../src/write/mint-mgr.js";

const state = {
  mintQueueSize: 5,
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

globalThis.ContractAssert = (expr, text) => {
  if (!expr) {
    throw new Error("Assert: " + text);
  }
};

globalThis.SmartWeave = {
  transaction: {
    id: "QBM3U4E0nCJqWVMnKGRaSnN-xEY_b1m7RTAX-uGfwSw",
  },
  block: {
    height: 1003,
  },
};

test("add new Request to queue", () => {
  globalThis.SmartWeave = {
    transaction: {
      id: "QBM3U4E0nCJqWVMnKGRaSnN-xEY_b1m7RTAX-uGfwSw",
    },
    block: {
      height: 1003,
    },
  };

  let result = mintRequest(state, {
    caller: "7kz1dAFBtElpQfcPeteBYYg_cnik8JMeKefjaZZ3Zgg",
    input: {
      function: "mintRequest",
      amount: 1 * 1e12,
      fee: 1,
    },
  });

  assert.equal(
    result.state.mints["QBM3U4E0nCJqWVMnKGRaSnN-xEY_b1m7RTAX-uGfwSw"].height,
    1008
  );
});

test("amount to large", () => {
  globalThis.SmartWeave = {
    transaction: {
      id: "QBM3U4E0nCJqWVMnKGRaSnN-xEY_b1m7RTAX-uGfwSw",
    },
    block: {
      height: 1003,
    },
  };
  try {
    mintRequest(state, {
      caller: "7kz1dAFBtElpQfcPeteBYYg_cnik8JMeKefjaZZ3Zgg",
      input: {
        function: "mintRequest",
        amount: 2 * 1e12,
        fee: 1,
      },
    });
  } catch (e) {
    assert.equal(
      e.message,
      "Assert: amount must be less than or equal to 1 AR"
    );
  }
});

test("can only have 5 queued items", () => {
  globalThis.SmartWeave = {
    transaction: {
      id: "fuV_HaZqsyUzbFNK6FDYQA1OS0-7My12gDH5FWpbNC4",
    },
    block: {
      height: 1003,
    },
  };

  const fullState = over(
    lensProp("mints"),
    assoc("V6RcfOLtld4D4wEdREv2Gd30zEdMFe_q-bENgudL5YU", {
      amount: 5 * 1e6,
      fee: 3,
      addr: "89tR0-C1m3_sCWCoVCChg4gFYKdiH5_ZDyZpdJ2DDRw",
      height: 1001,
    }),
    state
  );

  const res = mintRequest(fullState, {
    caller: "7kz1dAFBtElpQfcPeteBYYg_cnik8JMeKefjaZZ3Zgg",
    input: {
      function: "mintRequest",
      amount: 1 * 1e12,
      fee: 1,
    },
  });

  assert.equal(res.result, "Could not add to queue!");
});

test.run();
