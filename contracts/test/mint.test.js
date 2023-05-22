import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { mint } from '../src/write/mint.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('mint');

test.before(async () => {});

test('Should create a kv store', async () => {
  // set reward to 10
  const env = setupSmartWeaveEnv(
    999999,
    1,
    '<tx>',
    undefined,
    'ERROR',
    undefined,
    { jshaw: 1, tom: 1, dmac: 1 }
  );

  assert.is(await env.kv.get('jshaw'), 1);
  env.kv.put('jshaw', 2);
  assert.is(await env.kv.get('jshaw'), 2);
  env.kv.del('jshaw');
  assert.is(await env.kv.get('jshaw'), undefined);
});

test('should only mint new requests', async () => {
  const env = setupSmartWeaveEnv(
    999999,
    1,
    '<tx>',
    undefined,
    'ERROR',
    [
      {
        tx: 'not_expired',
        target: '<jshaw>',
        qty: 25,
        expires: 721,
      },
      { tx: 'not_expired2', target: '<jshaw>', qty: 25, expires: 721 },
      { tx: 'not_expired3', target: '<tom>', qty: 25, expires: 721 },
      {
        tx: 'expired2',
        expires: 0,
        qty: 5,
        target: '<jshaw>',
      },
      {
        tx: 'expired3',
        expires: 0,
        qty: 5,
        target: '<jshaw>',
      },
      {
        tx: 'expired4',
        expires: 0,
        qty: 5,
        target: '<jshaw>',
      },
      {
        tx: 'processed',
        expires: 721,
        qty: 5,
        target: '<jshaw>',
      },
    ],
    undefined
  );

  const caller = '<justin>';

  const output = await mint(env)(
    {
      ticker: 'REBAR',
      name: 'REBAR',
      balances: {},
      settings: [['isTradeable', true]],
      claimable: [],
      divisibility: 1e6,
      mint_contract: '<mint-contract>',
      pile: { processed: 1 },
    },
    { caller }
  ).toPromise();
  const state = output.state;

  assert.is(await env.kv.get('<jshaw>'), 50);
  assert.is(await env.kv.get('<tom>'), 25);
  assert.is(Object.keys(state.pile).length, 4);
});

test('should work with no requests TODO: udpate this test name', async () => {
  // set reward to 10
  const env = setupSmartWeaveEnv(
    1000000,
    0,
    '<tx>',
    undefined,
    'ERROR',
    [
      {
        tx: 'good',
        expires: 2,
        qty: 7,
        target: '<jshaw>',
      },
      {
        tx: 'good2',
        expires: 2,
        qty: 7,
        target: '<jshaw>',
      },
      {
        tx: 'processed',
        expires: 722,
        qty: 5,
        target: '<jshaw>',
      },
    ],
    {}
  );

  const caller = '<justin>';

  const output = await mint(env)(
    {
      ticker: 'REBAR',
      name: 'REBAR',
      balances: {},
      settings: [['isTradeable', true]],
      claimable: [],
      divisibility: 1e6,
      mint_contract: '<mint-contract>',
      pile: { processed: 1 },
    },
    { caller }
  ).toPromise();
  const state = output.state;
  assert.is(await env.kv.get('<jshaw>'), 14);
  assert.is(state.pile['processed'], 1);
});

test.after(async () => {});

test.run();
