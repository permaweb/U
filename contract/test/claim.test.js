import { suite } from "uvu";
import * as assert from "uvu/assert";
import { claim } from "../src/write/claim.js";
import { setupSmartWeaveEnv } from "./setup.js";
const test = suite("claim");

test.before(async () => {});

test.skip("should throw (txID must be passed to the claim function.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      claim(
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
    /txID must be passed to the claim function./
  );
});

test.skip("should throw (Claim already processed.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      claim(
        {
          name: "rebar",
          ticker: "rebar",
          balances: {},
          settings: [
            ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
            ["isTradeable", true],
          ],
          claims: ["<test-claim>"],
          claimable: [],
          divisibility: 6,
        },
        { caller, input: { txID: "<test-claim>" } }
      ),
    /Claim already processed./
  );
});

test.skip("should throw (There must be 1 claimable with this tx id.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      claim(
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
        { caller, input: { txID: "<test-claim>" } }
      ),
    /There must be 1 claimable with this tx id./
  );
});

test.skip("should throw (Claim not addressed to caller.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      claim(
        {
          name: "rebar",
          ticker: "rebar",
          balances: {},
          settings: [
            ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
            ["isTradeable", true],
          ],
          claims: [],
          claimable: [
            {
              txID: "<test-claim>",
              to: "<tom>",
            },
          ],
          divisibility: 6,
        },
        { caller, input: { txID: "<test-claim>" } }
      ),
    /Claim not addressed to caller./
  );
});

test.skip("should throw (Incorrect qty.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      claim(
        {
          name: "rebar",
          ticker: "rebar",
          balances: {},
          settings: [
            ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
            ["isTradeable", true],
          ],
          claims: [],
          claimable: [
            {
              txID: "<test-claim>",
              to: caller,
              qty: 11,
            },
          ],
          divisibility: 6,
        },
        { caller, input: { txID: "<test-claim>", qty: 10 } }
      ),
    /Incorrect qty./
  );
});

test.skip("should claim", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  const output = claim(
    {
      name: "rebar",
      ticker: "rebar",
      balances: {},
      settings: [
        ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
        ["isTradeable", true],
      ],
      claims: [],
      claimable: [
        {
          txID: "<test-claim>",
          to: caller,
          qty: 11,
          from: "<tom>",
        },
      ],
      divisibility: 6,
    },
    { caller, input: { txID: "<test-claim>", qty: 11 } }
  );
  const { state } = output;
  assert.is(state.balances[caller], 11);
  assert.is(state.claims[0], "<test-claim>");
  assert.is(state.claimable.length, 0);
});

test.after(async () => {});

test.run();
