import { balance } from './read/balance.js';
import { kill } from './write/kill.js';
import { add, remove } from './write/whitelist.js';
import { transfer } from './write/transfer.js';
import { allow } from './write/allow.js';
import { claim } from './write/claim.js';
import { rejectClaimable } from './write/reject.js';
import { mint } from './write/mint.js';
import { checkKillSwitch, checkWhitelist } from './util.js';

export async function handle(state, action) {
  checkKillSwitch(state.killswitch);
  checkWhitelist(state.whitelist, action.caller);
  const input = action.input;
  const env = {
    readContractState: SmartWeave.contracts.readContractState.bind(SmartWeave),
    viewContractState: SmartWeave.contracts.viewContractState.bind(SmartWeave),
    write: SmartWeave.contracts.write.bind(SmartWeave),
    block: SmartWeave.block,
    transaction: SmartWeave.transaction,
  };
  switch (input.function) {
    case 'kill':
      return await kill(state, action);
    case 'add':
      return await add(state, action);
    case 'remove':
      return await remove(state, action);
    case 'balance':
      return await balance(state, action);
    case 'mint':
      return mint(env)(state, action).toPromise();
    case 'transfer':
      return await transfer(state, action);
    case 'allow':
      return allow(state, action);
    case 'claim':
      return claim(state, action);
    case 'reject':
      return rejectClaimable(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
