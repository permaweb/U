export function setupSmartWeaveEnv(
  reward,
  height,
  id,
  readContractState, // pass `Promise.reject("<READ-ERROR>")` for error
  write // pass `Promise.reject("<WRITE-ERROR>")` for error
) {
  globalThis.SmartWeave = {
    transaction: {
      reward: reward || 1,
      id: id || "<test-tx>",
    },
    block: {
      height: height || 1,
    },
    contracts: {
      readContractState: async (contract) => {
        return readContractState;
      },
      write: async () => Promise.resolve(write),
    },
  };
  globalThis.ContractError = ContractError;
  return {
    readContractState: async (contract) =>
      SmartWeave.contracts.readContractState(contract),
    write: SmartWeave.contracts.write.bind(globalThis.SmartWeave),
    height: SmartWeave.block.height,
    reward: SmartWeave.transaction.reward,
    tx: SmartWeave.transaction.id,
  };
}

class ContractError {
  constructor(error) {
    throw new Error(error);
  }
}
