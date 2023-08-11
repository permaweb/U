import { balance } from './read/balance.js';
import { transfer } from './write/transfer.js';
import { claim } from './write/claim.js';
import { allow } from './write/allow.js';
import { mint } from './write/test-mint.js';
import { rejectClaimable } from './write/reject.js';

export async function handle(state, action) {
  // need to only accept L2 txs for transfer, allow, claim
  if (SmartWeave.transaction.origin === 'L1') {
    // skip these fns on L1
    return { state };
  }

  switch (action?.input?.function) {
    case 'balance':
      return balance(state, action);
    case 'reject':
      return rejectClaimable(state, action);
    case 'transfer':
      return transfer(state, action);
    case 'allow':
      return allow(state, action);
    case 'claim':
      return claim(state, action);
    case 'mint':
      return mint(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized`
      );
  }
}
