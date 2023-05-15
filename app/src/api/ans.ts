import Async from 'hyper-async';
const { of, fromPromise } = Async;

export function getAnsName(address: string) {
  return of(address).chain(fromPromise(fetchAnsName)).toPromise();
}

async function fetchAnsName(address: string) {
  const res = await fetch(
    `https://ans-resolver.herokuapp.com/resolve/${address}`
  );

  if (!res.ok) {
    console.log('Bad response:', res.status, res.statusText);
    throw new Error(res.statusText);
  }

  const data = await res.json();
  if (!data) {
    throw new Error('Invalid data received.');
  }

  if (!data.domain) {
    throw new Error('Address does not resolve an ANS name.');
  }
  return data.domain;
}
