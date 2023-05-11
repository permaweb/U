import { toPairs } from 'ramda';

export function setupSmartWeaveEnv(
  reward,
  height,
  id,
  readContractState, // pass `Promise.reject("<READ-ERROR>")` for error
  write, // pass `Promise.reject("<WRITE-ERROR>")` for error
  viewContractState,
  balances // Pass balances like {"<addr>": "<qty>"} and a proxy map will be built to mock SmartWeave.KV
) {
  const pairs = toPairs(balances);
  const map = new Map(pairs);

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
      viewContractState: async (contract, input) => ({
        result: viewContractState,
      }),
    },
    kv: {
      get: async (key) => map.get(key),
      put: async (caller, qty) => map.set(caller, qty),
      del: async (key) => map.delete(key),
    },
  };
  globalThis.ContractError = ContractError;
  return {
    kv: SmartWeave.kv,
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
