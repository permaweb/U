import { mint } from "./write/mint.js";
import { env } from "./smartweave.js";

export async function handle(state, action) {
  const input = action.input;
  switch (input.function) {
    case "mint":
      // throw new ContractError("TEST");
      return await mint(env)(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
