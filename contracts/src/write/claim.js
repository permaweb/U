import { fromNullable, of } from '../hyper-either.js';
import { ce, claimableByTx, setCallerBalance } from '../util.js';
import {
  assoc,
  __,
  compose,
  add,
  prop,
  find,
  reject,
  identity,
  filter,
} from 'ramda';
/**
 * Claims rebAR from claimables
 *
 * @author @jshaw-ar
 * @export
 * @param {*} state
 * @param {*} action
 * @return {*}
 */
export function claim(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(
      ce(!action.input?.txID, 'txID must be passed to the claim function.')
    )
    .chain(ce(!action.input?.qty, 'A qty must be specified.'))
    .chain(
      ce(
        !(
          filter((c) => claimableByTx(c, action.input.txID), state.claimable)
            .length === 1
        ),
        'There must be 1 claimable with this tx id.'
      )
    )
    .chain(
      ce(
        filter((c) => claimableByTx(c, action.input.txID), state.claimable)[0]
          ?.to !== action.caller,
        'Claim not addressed to caller.'
      )
    )
    .chain(
      ce(
        state.claimable.filter((c) => c.txID === action.input.txID)[0]?.qty !==
          action.input?.qty,
        'Incorrect qty.'
      )
    )
    .map(setCallerBalance)
    .map(handleClaim)
    .map(assoc('state', __, {}))
    .fold((msg) => {
      throw new ContractError(msg || 'An error occurred.');
    }, identity);
}

/**
 *
 *
 * @author @twilson63
 * @param {{state, action}} { state, action }
 * @return {*} state
 */
function handleClaim({ state, action }) {
  const txID = action.input.txID;
  const caller = action.caller;
  const byTx = (x) => x.txID === txID;

  return {
    ...state,
    balances: {
      ...state.balances,
      [caller]: compose(
        add(state.balances[caller]),
        prop('qty'),
        find(byTx),
        prop('claimable')
      )(state),
    },
    claimable: compose(reject(byTx), prop('claimable'))(state),
  };
}
