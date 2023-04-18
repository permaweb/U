export async function balance(state, action) {
  const { ticker, balances } = state;
  const { input, caller } = action;

  let target;
  if (!input.target) {
    target = caller;
  } else {
    target = input.target;
  }
  if (typeof target !== "string") {
    throw new ContractError("Must specify target to get balance for.");
  }
  if (typeof balances[target] !== "number") {
    throw new ContractError("Cannot get balance; target does not exist.");
  }
  return {
    result: {
      target,
      ticker,
      balance: balances[target],
    },
  };
}
