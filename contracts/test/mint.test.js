import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { mint } from '../src/write/mint.js';
import { setupSmartWeaveEnv } from './setup.js';
import { toPairs } from 'ramda';
const test = suite('mint');

test.before(async () => {});

test('should only mint new requests', async () => {
  // set reward to 10
  const env = setupSmartWeaveEnv(999999, 1, '<tx>', undefined, 'ERROR', {
    not_expired: {
      target: '<jshaw>',
      qty: 25,
      expires: 721,
    },
    expired2: {
      expires: 0,
      qty: 5,
      target: '<jshaw>',
    },
    expired3: {
      expires: 0,
      qty: 5,
      target: '<jshaw>',
    },
    expired4: {
      expires: 0,
      qty: 5,
      target: '<jshaw>',
    },
    processed: {
      expires: 721,
      qty: 5,
      target: '<jshaw>',
    },
  });

  const caller = '<justin>';

  const output = await mint(env)(
    {
      ticker: 'REBAR',
      name: 'REBAR',
      balances: {},
      settings: [['isTradeable', true]],
      claimable: [],
      divisibility: 6,
      mint_contract: '<mint-contract>',
      pile: ['processed'],
    },
    { caller }
  ).toPromise();
  const state = output.state;
  assert.is(state.balances['<jshaw>'], 25);
  assert.is(state.pile.length, 2);
});

test('should work with no requests TODO: udpate this test name', async () => {
  // set reward to 10
  const env = setupSmartWeaveEnv(1000000, 0, '<tx>', undefined, 'ERROR', {
    good: {
      expires: 2,
      qty: 7,
      target: '<jshaw>',
    },
    good2: {
      expires: 2,
      qty: 7,
      target: '<jshaw>',
    },
    processed: {
      expires: 722,
      qty: 5,
      target: '<jshaw>',
    },
  });

  const caller = '<justin>';

  const output = await mint(env)(
    {
      ticker: 'REBAR',
      name: 'REBAR',
      balances: {},
      settings: [['isTradeable', true]],
      claimable: [],
      divisibility: 6,
      mint_contract: '<mint-contract>',
      pile: ['processed'],
    },
    { caller }
  ).toPromise();
  const state = output.state;
  assert.is(state.balances['<jshaw>'], 14);
  assert.is(state.pile.filter((v) => v === 'processed').length, 1);
});

test.after(async () => {});

test.run();
