export function allow(state, action) {
  const { balances } = state;
  const { caller, input } = action;
  const { qty, target } = input;
  validateQuantityGreaterThanZero(qty);

  validateTarget(caller, target);

  validateBalanceGreaterThanQuantity(balances[caller], qty);
  balances[caller] -= qty;
  if (!balances[target]) {
    balances[target] = 0;
  }
  validateBalance(balances[caller]);
  validateBalance(balances[target]);
  balances[target] += qty;
  return { state };
}
