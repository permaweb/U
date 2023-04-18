import { suite } from "uvu";
import * as assert from "uvu/assert";
import { allow } from "../src/write/allow.js";
import { setupSmartWeaveEnv } from "./setup.js";
const test = suite("allow");

test.before(async () => {});

test("should throw (Please specify a target.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      allow(
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
      ),
    /Please specify a target./
  );
});

test("should throw (Target cannot be caller.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      allow(
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
        { caller, input: { target: caller } }
      ),
    /Target cannot be caller./
  );
});

test("should throw (Caller does not have a balance.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      allow(
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
        { caller, input: { target: "<tom>" } }
      ),
    /Caller does not have a balance./
  );
});

test("should throw (qty must be an integer.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      allow(
        {
          name: "rebar",
          ticker: "rebar",
          balances: {
            [caller]: 10,
          },
          settings: [
            ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
            ["isTradeable", true],
          ],
          claims: [],
          claimable: [],
          divisibility: 6,
        },
        { caller, input: { target: "<tom>" } }
      ),
    /qty must be an integer./
  );
});

test("should throw (Not enough tokens for allow.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      allow(
        {
          name: "rebar",
          ticker: "rebar",
          balances: {
            [caller]: 10,
          },
          settings: [
            ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
            ["isTradeable", true],
          ],
          claims: [],
          claimable: [],
          divisibility: 6,
        },
        { caller, input: { target: "<tom>", qty: 11 } }
      ),
    /Not enough tokens for allow./
  );
});

test("should throw (Not enough tokens for allow.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  const output = allow(
    {
      name: "rebar",
      ticker: "rebar",
      balances: {
        [caller]: 10,
      },
      settings: [
        ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
        ["isTradeable", true],
      ],
      claims: [],
      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: "<tom>", qty: 10 } }
  );

  const { state } = output;
  assert.equal(state.balances[caller], 0);
});

test.after(async () => {});

test.run();
