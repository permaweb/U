import { createMint } from "./write/create-mint.js";
import { env } from "./smartweave.js";
import { filterInvalid } from "./util.js";

export async function handle(state, action) {
  const requests = filterInvalid(state.requests, env.block.height);
  switch (action.input.function) {
    case "create-mint":
      return createMint(env)({ ...state, requests }, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
