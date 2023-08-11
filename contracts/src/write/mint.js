import { roundDown } from '../util.js';

export function mint(state, action) {
  if (!state.balances[action.caller]) {
    state.balances[action.caller] = 0;
  }

  state.balances[action.caller] += roundDown(
    SmartWeave.transaction.reward / state.divisibility
  );

  return { state };
}
