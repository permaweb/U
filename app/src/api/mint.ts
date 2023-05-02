import Async from "hyper-async";
import { getWarpFactory } from "./common";
const { of, fromPromise } = Async;

export function mint(contractId: string) {
  return of(contractId)
    .chain(fromPromise(warpMint))
    .fork(
      (e: any) => {
        console.log(e);
        return { error: "There was an error fetching the contract state" };
      },
      (res: any) => {
        console.log("res", res);
        return res;
      }
    );
}

const warpMint = async (tx: string) => {
  const CACHE = "https://cache.permapages.app";
  const warp = getWarpFactory();
  if (!import.meta.env.VITE_LOCAL)
    await warp.contract(tx).syncState(CACHE + "/contract", { validity: true });
  const contract = warp
    .contract(tx)
    .connect("use_wallet")
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
    });
  return contract.writeInteraction({
    function: "mint",
  });
};
