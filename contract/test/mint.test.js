import { suite } from "uvu";
import * as assert from "uvu/assert";
import { mint } from "../src/write/mint-mgr.js";
import { setupSmartWeaveEnv } from "./setup.js";
const test = suite("mint");

test.before(async () => {});

test("should mint 1", async () => {
  setupSmartWeaveEnv(1, 20);
  const caller = "<justin>";
  const output = await mint(
    {
      name: "rebar",
      ticker: "PC",
      balances: {},
      mints: {
        "<tx>": {
          amount: 1,
          fee: 1,
          height: 10,
          addr: "<justin>",
        },
        "<another-tx>": {
          amount: 1,
          fee: 1,
          height: 10,
          addr: "<justin>",
        },
      },
      orders: {},
      settings: [
        ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
        ["isTradeable", true],
      ],
      divisibility: 12,
    },
    { caller, input: { tx: "<tx>" } }
  );
  const state = output.state;
  assert.is(state.balances["<justin>"], 1);
});

test("should throw if block height too high", async () => {
  // set block height below mint.height
  setupSmartWeaveEnv(1, 9);
  const caller = "<justin>";
  const height = 10;

  assert.throws(
    () =>
      mint(
        {
          name: "rebar",
          ticker: "PC",
          balances: {},
          mints: {
            "<tx>": {
              amount: 1,
              fee: 1,
              height,
              addr: "<justin>",
            },
          },
          orders: {},
          settings: [
            ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
            ["isTradeable", true],
          ],
          divisibility: 12,
        },
        { caller, input: { tx: "<tx>" } }
      ),
    /Mint request expired./
  );
});

test.after(async () => {});

test.run();
