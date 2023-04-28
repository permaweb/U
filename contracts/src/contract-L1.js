import { createMint } from "./write/create-mint.js";
import { env } from "./smartweave.js";

export async function handle(state, action) {
  switch (input.function) {
    case "create-mint":
      return createMint(env)({ ...state, requests }, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
