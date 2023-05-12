export async function balance(state, action) {
  const addr = action?.input?.target || action.caller;
  return {
    result: {
      target: addr,
      ticker: state.ticker,
      balance: (await SmartWeave.kv.get(addr)) || 0,
    },
  };
}
