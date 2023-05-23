import Async from 'hyper-async';
const { of, fromPromise } = Async;
import { getWarpFactory, syncState } from './common';
import BigNumber from 'bignumber.js';
import { identity } from 'ramda';

/**
 * @author @jshaw-ar
 * @export
 * @param {{ contractId: string; qty: number }} input
 * @return {*}
 */
export function createMint(input: { contractId: string; qty: number }) {
  return of(input)
    .chain(fromPromise(createMintL1))
    .fork((e: any) => {
      return { error: 'There was an error fetching the contract state' };
    }, identity);
}

/**
 * @author @jshaw-ar
 * @param {{ contractId: string; qty: number }} input
 * @return {*}
 */
const createMintL1 = async (input: { contractId: string; qty: number }) => {
  const { contractId, qty } = input;
  const warp = getWarpFactory();
  if (!import.meta.env.VITE_LOCAL) await syncState(warp, contractId);
  const contract = warp
    .contract(contractId)
    .connect('use_wallet')
    .setEvaluationOptions({
      allowBigInt: true,
      unsafeClient: 'skip',
    });
  return contract.writeInteraction(
    {
      function: 'create-mint',
    },
    {
      reward: new BigNumber(qty * 1e12)
        .integerValue(BigNumber.ROUND_DOWN)
        .toString(),
    }
  );
};
