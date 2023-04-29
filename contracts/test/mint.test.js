import { suite } from "uvu";
import * as assert from "uvu/assert";
import { mint } from "../src/write/mint.js";
import { setupSmartWeaveEnv } from "./setup.js";
const test = suite("mint");

test.before(async () => {});

test("should not mint bar with reward lower than 1M", async () => {
  // set reward to 10
  const env = setupSmartWeaveEnv(
    999999,
    10,
    "<tx>",
    {
      ticker: "REBAR_MINT",
      name: "REBAR_MINT",
      settings: [["isTradeable", false]],
      requests: {
        zero_qty: {
          target: "<jshaw>",
          qty: 0,
          expires: 722,
        },
        expired: {
          expires: 0,
        },
        good: {
          expires: 2,
          qty: 5,
          target: "<jshaw>",
        },
        good: {
          expires: 2,
          qty: 5,
          target: "<jshaw>",
        },
      },
    },
    "ERROR"
  );

  const caller = "<justin>";
  const output = await mint(env)(
    {
      name: "rebar",
      mint_contract: "<mint-contract-2>",
      ticker: "rebar",
      balances: {},
      settings: [
        ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
        ["isTradeable", true],
      ],
      claimable: [],
      divisibility: 6,
    },
    { caller }
  );
  const state = output.state;
  assert.is(state.balances["good"], 5);
});

test.after(async () => {});

test.run();
