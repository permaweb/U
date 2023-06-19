import { WarpFactory } from 'warp-contracts';

/**
 *
 * @author @jshaw-ar
 * @export
 * @return {Warp}
 */
export function getWarpFactory() {
  return import.meta.env.VITE_LOCAL === 'true'
    ? WarpFactory.forLocal()
    : WarpFactory.forMainnet();
}

/**
 *
 * @author @jshaw-ar
 * @export
 * @todo turn this into an async pipe so it's easier to read
 * @param {string} tx
 * @return {*}
 */
export const readState = async (tx: string) => {
  const warp = getWarpFactory();
  return warp
    .contract(tx)
    .connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      unsafeClient: 'skip',
      remoteStateSyncSource: 'https://dre-1.warp.cc/contract',
      remoteStateSyncEnabled:
        import.meta.env.VITE_LOCAL === 'true' ? false : true,
      allowBigInt: true,
    })
    .readState()
    .then((s) => s.cachedValue.state)
    .catch(() =>
      warp
        .contract(tx)
        .connect('use_wallet')
        .setEvaluationOptions({
          internalWrites: true,
          unsafeClient: 'skip',
          remoteStateSyncSource: 'https://dre-2.warp.cc/contract',
          remoteStateSyncEnabled:
            import.meta.env.VITE_LOCAL === 'true' ? false : true,
          allowBigInt: true,
        })
        .readState()
        .then((s) => s.cachedValue.state)
        .catch((e) =>
          warp
            .contract(tx)
            .connect('use_wallet')
            .setEvaluationOptions({
              internalWrites: true,
              unsafeClient: 'skip',
              remoteStateSyncSource: 'https://dre-3.warp.cc/contract',
              remoteStateSyncEnabled:
                import.meta.env.VITE_LOCAL === 'true' ? false : true,
              allowBigInt: true,
            })
            .readState()
            .then((s) => s.cachedValue.state)
            .catch(() =>
              warp
                .contract(tx)
                .connect('use_wallet')
                .setEvaluationOptions({
                  internalWrites: true,
                  unsafeClient: 'skip',
                  remoteStateSyncSource: 'https://dre-4.warp.cc/contract',
                  remoteStateSyncEnabled:
                    import.meta.env.VITE_LOCAL === 'true' ? false : true,
                  allowBigInt: true,
                })
                .readState()
                .then((s) => s.cachedValue.state)
                .catch(() =>
                  warp
                    .contract(tx)
                    .connect('use_wallet')
                    .setEvaluationOptions({
                      internalWrites: true,
                      unsafeClient: 'skip',
                      remoteStateSyncSource: 'https://dre-6.warp.cc/contract',
                      remoteStateSyncEnabled:
                        import.meta.env.VITE_LOCAL === 'true' ? false : true,
                      allowBigInt: true,
                    })
                    .readState()
                    .then((s) => s.cachedValue.state)
                    .catch(() =>
                      warp
                        .contract(tx)
                        .connect('use_wallet')
                        .setEvaluationOptions({
                          internalWrites: true,
                          unsafeClient: 'skip',
                          remoteStateSyncSource:
                            'https://dre-1.warp.cc/contract',
                          remoteStateSyncEnabled:
                            import.meta.env.VITE_LOCAL === 'true'
                              ? false
                              : true,
                          allowBigInt: true,
                        })
                        .readState()
                        .then((s) => s.cachedValue.state)
                    )
                )
            )
        )
    );
};

/**
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @param {any} input
 * @param {string} dre
 * @return {*}
 */
export const viewState = async (tx: string, input: any, dre: string) => {
  const warp = getWarpFactory();
  const interaction = warp
    .contract(tx)
    .setEvaluationOptions({
      remoteStateSyncSource: `https://${dre}.warp.cc/contract`,
      remoteStateSyncEnabled:
        import.meta.env.VITE_LOCAL === 'true' ? false : true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .viewState(input);
  if ((await interaction).type === 'ok') return interaction;
  throw new Error(`There was an error evaluating state using ${dre}.`);
};
