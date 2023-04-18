export function transfer(state, action) {
  const { balances } = state;
  const { caller, input } = action;
  const { qty, target } = input;

  balances[caller] -= qty;
  if (!balances[target]) {
    balances[target] = 0;
  }

  balances[target] += qty;
  return { state };
}
