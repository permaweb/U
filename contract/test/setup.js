export function setupSmartWeaveEnv(reward, height, id) {
  globalThis.SmartWeave = {
    transaction: {
      reward: reward || 1,
      id: id || "<test-tx>",
    },
    block: {
      height: height || 1,
    },
  };
  globalThis.ContractError = ContractError;
}

class ContractError {
  constructor(error) {
    throw new Error(error);
  }
}
