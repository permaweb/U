export function setupSmartWeaveEnv(reward, height) {
  globalThis.SmartWeave = {
    transaction: {
      reward: reward || 1,
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
