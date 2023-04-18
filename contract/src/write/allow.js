export async function allow(state, action) {
  const { caller, input } = action;
  const { target, qty } = input;
  const { balances, claimable } = state;
  const newQty = Math.floor(qty);

  validateTarget(caller, target);
  validateBalanceGreaterThanQuantity(balances[caller], newQty);
  // Set target to 0 if it doesn't exist
  if (!balances[target]) balances[target] = 0;
  balances[caller] -= newQty;
  validateBalance(balances[caller]);
  claimable.push({
    from: caller,
    to: target,
    qty: newQty,
    tx: SmartWeave.transaction.id,
  });
  return { state };
}
