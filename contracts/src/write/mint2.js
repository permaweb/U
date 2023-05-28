import { roundDown } from '../util.js';

export async function mint(state, action) {
  if (Number(SmartWeave.transaction.reward) <= 72600854) {
    // skip mint this is a L2
    return { state }
  }

  if (!state.balances[action.caller]) {
    state.balances[action.caller] = 0
  }

  state.balances[action.caller] += roundDown(SmartWeave.transaction.reward / state.divisibility)

  return { state }
}