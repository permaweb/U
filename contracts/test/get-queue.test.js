import { suite } from "uvu";
import * as assert from "uvu/assert";
import { getQueue } from "../src/read/get-queue.js";
import { setupSmartWeaveEnv } from "./setup.js";
import { toPairs } from "ramda";

const test = suite("get-queue");

test.before(async () => {});

test("should return requests 2", async () => {
  // set reward to 10
  setupSmartWeaveEnv(999999, 10, "<tx>", undefined, "ERROR", {
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
    processed: {
      expires: 722,
      qty: 5,
      target: "<jshaw>",
    },
  });

  const caller = "<justin>";

  const queue = getQueue(
    {
      // STATE STUBBED WITH 2 REQUESTS
      requests: {
        one: { qty: 5, target: "<justin>", expires: 5 },
        two: { qty: 5, target: "<tom>", expires: 5 },
      },
    },
    { caller }
  ).result;
  const pairs = toPairs(queue);
  assert.is(queue["one"].target, "<justin>");
  assert.is(queue["two"].target, "<tom>");
  assert.is(pairs.length, 2);
});

test.after(async () => {});

test.run();
