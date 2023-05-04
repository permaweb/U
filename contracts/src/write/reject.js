import { fromNullable, of } from '../hyper-either.js';
import { ce, isClaimableByTx } from '../util.js';
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
export function rejectClaimable(state, action) {
  return of({ state, action })
    .chain(fromNullable)
    .chain(ce(!action.input?.tx, 'txID must be passed to the reject function.'))
    .chain(
      ce(
        filter((c) => isClaimableByTx(c, action.input?.tx), state.claimable)
          .length !== 1,
        'Claim does not exist.'
      )
    )
    .chain(
      ce(
        filter((c) => isClaimableByTx(c, action.input?.tx), state.claimable)[0]
          ?.to !== action.caller,
        'Claim not addressed to caller.'
      )
    )
    .map(handleReject)
    .map(assoc('state', __, {}))
    .fold((msg) => {
      throw new ContractError(msg || 'An error occurred.');
    }, identity);
}

/**
 * @author @jshaw-ar
 * @param {{state, action}} { state, action }
 * @return {*} state
 */
function handleReject({ state, action }) {
  const txID = action.input.tx;
  const byTx = (x) => x.txID === txID;
  const claim = filter(
    (c) => isClaimableByTx(c, action.input?.tx),
    state.claimable
  )[0];
  return {
    ...state,
    balances: {
      ...state.balances,
      [claim.from]: compose(
        add(state.balances[claim.from]),
        prop('qty'),
        find(byTx),
        prop('claimable')
      )(state),
    },
    claimable: compose(reject(byTx), prop('claimable'))(state),
  };
}
