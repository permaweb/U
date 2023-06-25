export function mint(state, action) {
  // initialize state.block
  if (!state.block) state.block = SmartWeave?.block?.height + 720;

  // Clean out minted every ~24hrs / 720 blocks
  if (SmartWeave?.block?.height > state.block) {
    state.block = SmartWeave?.block?.height + 720;
    state.minted = [];
  }

  // Only let users mint 1 time per day.
  if (state.minted.includes(action.caller)) return { state };

  // Add 1 test U to balance
  const balance = state.balances[action.caller] || 0;
  state.balances[action.caller] = balance + 1000000;
  state.minted.push(action.caller);

  return { state };
}
