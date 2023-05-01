import { createMint } from "./write/create-mint.js";
import { getQueue } from "./read/get-queue.js";
import { env } from "./smartweave.js";
import { filterInvalid } from "./util.js";

export async function handle(state, action) {
  const requests = filterInvalid(state.requests, env.block.height);
  switch (action.input.function) {
    case "create-mint":
      return createMint(env)({ ...state, requests }, action);
    case "get-queue":
      return getQueue(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
