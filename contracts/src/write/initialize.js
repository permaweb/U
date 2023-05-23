export async function initialize(state, action) {
  if (state.initialized) return state;
  Object.keys(action.input.initialBalances).map(
    (k) => (state.balances[k] = action.input.initialBalances[k])
  );
  state.initialized = true;
  return { state };
}
