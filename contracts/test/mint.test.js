import { suite } from "uvu";
import * as assert from "uvu/assert";
import { mint } from "../src/write/mint.js";
import { setupSmartWeaveEnv } from "./setup.js";
const test = suite("mint");

test.before(async () => {});

test.skip("should not mint bar with reward lower than 1M", async () => {
  // set reward to 10
  const env = setupSmartWeaveEnv(
    999999,
    10,
    "<tx>",
    {
      ticker: "REBAR_MINT",
      name: "REBAR_MINT",
      settings: [["isTradeable", false]],
      requests: {},
    },
    "ERROR"
  );

  const caller = "<justin>";
  const output = mint(env)(
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
  assert.is(state.balances["<justin>"], 0);
});

test.after(async () => {});

test.run();
