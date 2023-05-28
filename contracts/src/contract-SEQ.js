import { balance } from './read/balance.js';
import { transfer } from './write/transfer.js';
import { allow } from './write/allow.js';
import { claim } from './write/claim.js';
import { rejectClaimable } from './write/reject.js';
import { mint } from './write/mint.js';

export async function handle(state, action) {
  const env = {
    readContractState: async (id) => {
      const _state = await SmartWeave.contracts.readContractState(id)
      console.log({ _state })
      return _state
    },
    block: SmartWeave.block,
    transaction: SmartWeave.transaction
  };

  const input = action.input;

  switch (input.function) {
    case 'balance':
      return balance(state, action);
    case 'mint':
      return mint(env)(state).toPromise();
    case 'transfer':
      return transfer(state, action);
    case 'allow':
      return allow(env)(state, action);
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
