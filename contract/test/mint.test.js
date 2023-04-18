import { suite } from "uvu";
import * as assert from "uvu/assert";
import { mint } from "../src/write/mint.js";
import { setupSmartWeaveEnv } from "./setup.js";
const test = suite("mint");

test.before(async () => {});

test("should mint 10", async () => {
  // set reward to 10
  setupSmartWeaveEnv(100000);

  const caller = "<justin>";
  const output = await mint(
    {
      name: "rebar",
      ticker: "rebar",
      balances: {},
      settings: [
        ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
        ["isTradeable", true],
      ],
      claims: [],
      claimable: [],
      divisibility: 6,
    },
    { caller }
  );
  const state = output.state;
  console.log("STATE", state);
  assert.is(state.balances["<justin>"], 10);
});

test.after(async () => {});

test.run();
