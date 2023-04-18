export function claim(state, action) {
  const { claimable, claims, balances } = state;
  const { caller, input } = action;
  const { qty, tx } = input;
  const obj = validateClaim(tx, claims, claimable, caller);

  validateTx(tx);

  const filteredClaim = claimable.filter((c) => c.tx === tx)[0];
  const filteredClaimable = claimable.filter((c) => c.tx !== tx);

  validateQuantityOfClaim(qty, filteredClaim.qty);

  if (!Number.isInteger(balances[caller])) balances[caller] = 0;

  balances[caller] += obj.qty;
  claims.push(tx);
  state.claimable = filteredClaimable;

  return { state };
}
