import { createMint } from './write/create-mint.js';
import { getQueue } from './read/get-queue.js';
import { removeExpired } from './util.js';

export async function handle(state, action) {
  const env = {
    block: SmartWeave.block,
    transaction: SmartWeave.transaction,
  };

  state.requests = removeExpired(state.requests, env.block.height);

  switch (action.input.function) {
    case 'create-mint':
      return createMint(env)(state, action);
    case 'get-queue':
      return getQueue(state, action);
    case 'mint':
      return getQueue(state, action);
    default:
      throw new ContractError(
        `L1 Contract: No function supplied or function not recognized ${action?.input?.function}`
      );
  }
}
