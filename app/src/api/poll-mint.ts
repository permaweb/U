import Async from 'hyper-async';
const { of, fromPromise } = Async;

export function pollMint(tx: string) {
  return of(tx).chain(fromPromise(waitForConfirmation));
}

/**
 * Gets the polling tx if it exists
 *
 * @author @jshaw-ar
 * @export
 * @return {string}
 */
export function getPollingTx(): string | null {
  return localStorage.getItem('polling_tx');
}

/**
 * Polls the tx until it's not pending
 *
 * @author @jshaw-ar
 * @param {string} tx
 * @return {*}
 */
export async function waitForConfirmation(tx: string) {
  let res = null;

  while (res === null || res?.status === 202) {
    await new Promise((resolve) => setTimeout(resolve, 20000)); // Delay for 20 second
    res = await fetch(
      `${
        import.meta.env.VITE_LOCAL === 'true'
          ? 'http://localhost:1984'
          : 'https://arweave.net'
      }/tx/${tx}`
    );
    console.log(res.status);
  }
  console.log(res.status, res.statusText);
  localStorage.removeItem('polling_tx');
  return { tx, status: res.status };
}
