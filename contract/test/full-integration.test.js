import { suite } from "uvu";
import * as assert from "uvu/assert";
import { mint } from "../src/write/mint.js";
import { setupSmartWeaveEnv } from "./setup.js";
const test = suite("full-integration");

test.before(async () => {
  // Setup warp with 2 wallets
});

test("mint", async () => {});

test("transfer", async () => {});

test("allow", async () => {});

test("claim", async () => {});

test("balance", async () => {});

test.after(async () => {
  // Shut everything down
});

test.run();
