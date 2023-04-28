/**
 * Smartweave global
 *
 * - SmartWeave.transaction.id
 * - SmartWeave.transaction.reward
 * - SmartWeave.block.height
 * - SmartWeave.block.timestamp
 * - etc
 *
 * and access to some of the arweave utils:
 * - SmartWeave.arweave.utils
 * - SmartWeave.arweave.crypto
 * - SmartWeave.arweave.wallets
 * - SmartWeave.arweave.ar
 *
 */

export const env = {
  readContractState: SmartWeave.contracts.readContractState.bind(SmartWeave),
  write: SmartWeave.contracts.write.bind(SmartWeave),
  height: SmartWeave.block.height,
  reward: SmartWeave.transaction.reward,
};
