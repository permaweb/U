import { getQueue } from './read/get-queue.js';
import { createMint } from './write/create-mint.js';
import { kill } from './write/kill.js';
import { add, remove } from './write/whitelist.js';
import { filterInvalid, checkKillSwitch, checkWhitelist } from './util.js';

export async function handle(state, action) {
  // GATE
  checkKillSwitch(state.killswitch);
  checkWhitelist(state.whitelist, action.caller);
  // GATE END

  const env = {
    readContractState: SmartWeave.contracts.readContractState.bind(SmartWeave),
    viewContractState: SmartWeave.contracts.viewContractState.bind(SmartWeave),
    write: SmartWeave.contracts.write.bind(SmartWeave),
    block: SmartWeave.block,
    transaction: SmartWeave.transaction,
  };

  const requests = filterInvalid(state.requests, env.block.height);

  switch (action.input.function) {
    case 'kill':
      return await kill(state, action);
    case 'add':
      return await add(state, action);
    case 'remove':
      return await remove(state, action);
    case 'create-mint':
      return createMint(env)({ ...state, requests }, action);
    case 'get-queue':
      return getQueue(state, action);

    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
