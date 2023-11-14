import { balance } from './read/balance.js';
import { transfer } from './write/transfer.js';
import { claim } from './write/claim.js';
import { allow } from './write/allow.js';
import { mint } from './write/mint.js';
import { rejectClaimable } from './write/reject.js';

export async function handle(state, action) {
  // need to only accept L2 txs for transfer, allow, claim
  if (
    ['transfer', 'allow', 'claim', 'reject'].includes(
      action?.input?.function,
    ) &&
    SmartWeave.transaction.origin === 'L1'
  ) {
    // skip these fns on L1
    return { state };
  }

  if (
    action?.input?.function === 'mint' &&
    SmartWeave.transaction.origin === 'L2'
  )
    return { state }; // skip mint on L2

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
        `No function supplied or function not recognized`,
      );
  }
}
