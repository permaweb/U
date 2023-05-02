import Async from "hyper-async";
import { getWarpFactory } from "./common";
const { of, fromPromise } = Async;

export function getState(tx: string) {
  return of(tx)
    .chain((tx: string) => fromPromise(readState)(tx))
    .map((input: any) => input)
    .fork(
      (e: any) => {
        console.log(e);
        return { error: "There was an error fetching the contract state" };
      },
      (state: any) => state
    );
}

const readState = async (tx: string) => {
  const CACHE = "https://cache.permapages.app";
  const warp = getWarpFactory();
  if (!import.meta.env.VITE_LOCAL)
    await warp.contract(tx).syncState(CACHE + "/contract", { validity: true });
  const contract = await warp
    .contract(tx)
    .connect("use_wallet")
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
    })
    .readState();
  return contract.cachedValue.state;
};
