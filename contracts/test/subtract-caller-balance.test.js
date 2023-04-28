import { suite } from "uvu";
import * as assert from "uvu/assert";
import { subtractCallerBalance } from "../src/util.js";
const test = suite("subtract-caller-balance");

test.before(async () => {});

test.skip("should subtract 10 from caller balance", async () => {
  const caller = "<justin>";
  const output = subtractCallerBalance({
    state: {
      name: "rebar",
      ticker: "rebar",
      balances: {
        "<justin>": 20,
      },
      settings: [
        ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
        ["isTradeable", true],
      ],
      claimable: [],
      divisibility: 6,
    },
    action: { caller, input: { qty: 10 } },
  });
  const state = output.state;
  assert.is(state.balances["<justin>"], 10);
});

test.after(async () => {});

test.run();
