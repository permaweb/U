export async function initialize(state, action) {
  if (state.initialized) return state;
  await Promise.all(
    Object.keys(action.input.initialBalances).map((k) =>
      SmartWeave.kv.put(k, action.input.initialBalances[k])
    )
  );
  state.initialized = true;
  return { state };
}
