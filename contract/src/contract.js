import { balance } from "./read/balance.js";
import { transfer } from "./write/transfer.js";
import { mintRequest, expireStaleRequests, mint } from "./write/mint-mgr.js";

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
    case "mintRequest":
      return mintRequest(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
