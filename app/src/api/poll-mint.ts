import Async from 'hyper-async';
const { of, fromPromise } = Async;
import { identity } from 'ramda';

export function pollMint(tx: string) {
  return of(tx)
    .map(setLocalStorage)
    .chain(fromPromise(waitForConfirmation))
    .fork((e: any) => {
      return { error: 'There was an error fetching the contract state' };
    }, identity);
}

/**
 * Sets the polling tx so the tx can be re-polled during
 *
 * @author @jshaw-ar
 * @param {string} tx
 * @return {*}
 */
export function setLocalStorage(tx: string) {
  localStorage.setItem('polling_tx', tx);
  return tx;
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
    await new Promise((resolve) => setTimeout(resolve, 20000)); // Delay for 1 second
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
  if (res.status === 200) {
    localStorage.removeItem('polling_tx');
  }
  return { tx, status: res.status };
}
