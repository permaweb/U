import { Warp, WarpFactory } from 'warp-contracts';

export function getWarpFactory() {
  return import.meta.env.VITE_LOCAL === 'true'
    ? WarpFactory.forLocal()
    : WarpFactory.forMainnet();
}

export async function syncState(warp: Warp, contractId: string) {
  const CACHE = 'https://cache.permapages.app';
  await warp
    .contract(contractId)
    .syncState(CACHE + '/contract', { validity: true });
}

export const readState = async (tx: string) => {
  const warp = getWarpFactory();
  if (!import.meta.env.VITE_LOCAL) await syncState(warp, tx);
  const contract = await warp
    .contract(tx)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
    })
    .readState();
  return contract.cachedValue.state;
};
