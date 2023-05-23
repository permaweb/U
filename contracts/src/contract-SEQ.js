import { balance } from './read/balance.js';
import { transfer } from './write/transfer.js';
import { allow } from './write/allow.js';
import { claim } from './write/claim.js';
import { initialize } from './write/initialize.js';
import { rejectClaimable } from './write/reject.js';
import { mint } from './write/mint.js';

export async function handle(state, action) {
  const env = {
    readContractState: SmartWeave.contracts.readContractState.bind(SmartWeave),
    viewContractState: SmartWeave.contracts.viewContractState.bind(SmartWeave),
    write: SmartWeave.contracts.write.bind(SmartWeave),
    block: SmartWeave.block,
    transaction: SmartWeave.transaction,
    kv: SmartWeave.kv,
  };

  const input = action.input;

  switch (input.function) {
    case 'balance':
      return balance(state, action);
    case 'mint':
      return mint(env)(state, action).toPromise();
    case 'transfer':
      return transfer(env)(state, action);
    case 'allow':
      return allow(env)(state, action);
    case 'claim':
      return claim(env)(state, action);
    case 'reject':
      return rejectClaimable(state, action);
    case 'initialize':
      return initialize(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
