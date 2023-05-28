import { createMint } from './write/create-mint.js';
import { getQueue } from './read/get-queue.js';
import { removeExpired } from './util.js';

export async function handle(state, action) {
  const env = {
    readContractState: SmartWeave.contracts.readContractState.bind(SmartWeave),
    viewContractState: SmartWeave.contracts.viewContractState.bind(SmartWeave),
    write: SmartWeave.contracts.write.bind(SmartWeave),
    block: SmartWeave.block,
    transaction: SmartWeave.transaction,
  };

  state.requests = removeExpired(state.requests, env.block.height);

  switch (action.input.function) {
    case 'create-mint':
      return createMint(env)(state, action);
    case 'get-queue':
      return getQueue(state, action);
    case "mint":
      return getQueue(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
