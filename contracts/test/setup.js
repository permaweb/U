export function setupSmartWeaveEnv(
  reward,
  height,
  id,
  readContractState, // pass `Promise.reject("<READ-ERROR>")` for error
  write, // pass `Promise.reject("<WRITE-ERROR>")` for error
  viewContractState
) {
  globalThis.SmartWeave = {
    transaction: {
      reward: reward || 1,
      id: id || '<test-tx>',
    },
    block: {
      height: height || 1,
    },
    contracts: {
      readContractState: async (contract) => readContractState,
      write: async () => Promise.resolve(write),
      viewContractState: async (contract, input) => viewContractState,
    },
  };
  globalThis.ContractError = ContractError;
  return {
    readContractState: async (contract) =>
      SmartWeave.contracts.readContractState(contract),
    viewContractState: async (contract, input) =>
      SmartWeave.contracts.viewContractState(contract, input),
    write: SmartWeave.contracts.write.bind(globalThis.SmartWeave),
    block: SmartWeave.block,
    transaction: SmartWeave.transaction,
  };
}

class ContractError {
  constructor(error) {
    throw new Error(error);
  }
}
