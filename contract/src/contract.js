import { balance } from "./read/balance.js";
import { transfer } from "./write/transfer.js";
import { allow } from "./write/allow.js";
import { claim } from "./write/claim.js";
import { mint } from "./write/mint.js";

export async function handle(state, action) {
  state.mints = expireStaleRequests(state.mints);

  // beforeHandler(state, action);
  const input = action.input;
  switch (input.function) {
    case "balance":
      return await balance(state, action);
    case "mint":
      return await mint(state, action);
    case "transfer":
      return await transfer(state, action);
    case "allow":
      return allow(state, action);
    case "claim":
      return claim(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
