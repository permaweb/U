import { suite } from "uvu";
import * as assert from "uvu/assert";
import { transfer } from "../src/write/transfer.js";
import { setupSmartWeaveEnv } from "./setup.js";
const test = suite("transfer");

test.before(async () => {});

test("should throw (Please specify a target.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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
      ),
    /Please specify a target./
  );
});

test("should throw (Target cannot be caller.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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
      transfer(
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
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { target: "<tom>" } }
      ),
    /qty must be an integer./
  );
});

test("should throw (Not enough tokens for transfer.)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { target: "<tom>", qty: 11 } }
      ),
    /Not enough tokens for transfer./
  );
});

test("should not transfer null amount of tokens", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { target: "<tom>", qty: null } }
      ),
    /qty must be an integer./
  );
});

test("should not transfer undefined amount of tokens", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { target: "<tom>" } }
      ),
    /qty must be an integer./
  );
});

test("should not transfer 'string' amount of tokens", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { target: "<tom>", qty: "xxx" } }
      ),
    /qty must be an integer./
  );
});

test("should not transfer fractional amount of tokens", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { target: "<tom>", qty: 199999.01 } }
      ),
    /qty must be an integer./
  );
});

test("should not transfer fractional amount of tokens", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { target: "<tom>", qty: 199999.01 } }
      ),
    /qty must be an integer./
  );
});

test("should not transfer without a target", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { qty: 1000000 } }
      ),
    /Please specify a target./
  );
});

test("should not transfer with null target", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { qty: 1000000, target: null } }
      ),
    /Please specify a target./
  );
});

test("should not transfer with undefined target", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { qty: 1000000, target: undefined } }
      ),
    /Please specify a target./
  );
});

test("should not transfer from non-existing accout", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
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

          claimable: [],
          divisibility: 6,
        },
        { caller: "<non-existing>", input: { qty: 1000000, target: "<tom>" } }
      ),
    /Caller does not have a balance./
  );
});

test("should not transfer more than owned", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
        {
          name: "rebar",
          ticker: "rebar",
          balances: {
            [caller]: 1000000,
          },
          settings: [
            ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
            ["isTradeable", true],
          ],

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { qty: 2000000, target: "<tom>" } }
      ),
    /Not enough tokens for transfer./
  );
});

test("should not transfer 0 tokens", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
        {
          name: "rebar",
          ticker: "rebar",
          balances: {
            [caller]: 1000000,
          },
          settings: [
            ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
            ["isTradeable", true],
          ],

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { qty: 0, target: "<tom>" } }
      ),
    /Invalid token transfer. qty must be an integer greater than 0./
  );
});

test("should not transfer negative amount of tokens", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
        {
          name: "rebar",
          ticker: "rebar",
          balances: {
            [caller]: 1000000,
          },
          settings: [
            ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
            ["isTradeable", true],
          ],

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { qty: -1, target: "<tom>" } }
      ),
    /Invalid token transfer. qty must be an integer greater than 0./
  );
});

test("should not transfer to the same account (caller -> caller)", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  assert.throws(
    () =>
      transfer(
        {
          name: "rebar",
          ticker: "rebar",
          balances: {
            [caller]: 1000000,
          },
          settings: [
            ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
            ["isTradeable", true],
          ],

          claimable: [],
          divisibility: 6,
        },
        { caller, input: { qty: 1000000, target: caller } }
      ),
    /Target cannot be caller./
  );
});

test("should transfer to empty account", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  const state = transfer(
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
      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: "<tom>", qty: 10 } }
  );

  assert.equal(state.balances[caller], 0);
  assert.equal(state.balances["<tom>"], 10);
});

test("should transfer to existing account", () => {
  setupSmartWeaveEnv();
  const caller = "<justin>";
  const state = transfer(
    {
      name: "rebar",
      ticker: "rebar",
      balances: {
        [caller]: 10,
        "<tom>": 10,
      },
      settings: [
        ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
        ["isTradeable", true],
      ],
      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: "<tom>", qty: 10 } }
  );

  assert.equal(state.balances[caller], 0);
  assert.equal(state.balances["<tom>"], 20);
});

test.after(async () => {});

test.run();
