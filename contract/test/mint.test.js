import { suite } from "uvu";
import * as assert from "uvu/assert";
import { mint } from "../src/write/mint.js";
import { setupSmartWeaveEnv } from "./setup.js";
const test = suite("mint");

test.before(async () => {});

test("should not mint bar with reward lower than 1M", async () => {
  // set reward to 10
  setupSmartWeaveEnv(999999);

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
      claimable: [],
      divisibility: 6,
    },
    { caller }
  );
  const state = output.state;
  assert.is(state.balances["<justin>"], 0);
});

test("should mint new bars with empty balance", async () => {
  // set reward to 10
  setupSmartWeaveEnv(1000000);

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
      claimable: [],
      divisibility: 6,
    },
    { caller }
  );
  const state = output.state;
  assert.is(state.balances["<justin>"], 1);
});

test("should mint new bars with existing balance", async () => {
  // set reward to 10
  setupSmartWeaveEnv(2000123);

  const caller = "<justin>";
  const output = await mint(
    {
      name: "rebar",
      ticker: "rebar",
      balances: {
        "<justin>": 1,
      },
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
  assert.is(state.balances["<justin>"], 3);
});

test.after(async () => {});

test.run();
