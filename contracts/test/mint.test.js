import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { mint } from '../src/write/mint.js';
import { setupSmartWeaveEnv } from './setup.js';
import { toPairs } from 'ramda';
const test = suite('mint');

test.before(async () => {});

test('should not mint bar with reward lower than 1M', async () => {
  // set reward to 10
  const env = setupSmartWeaveEnv(999999, 1, '<tx>', undefined, 'ERROR', {
    zero_qty: {
      target: '<jshaw>',
      qty: 0,
      expires: 722,
    },
    expired: {
      expires: 0,
    },
    good: {
      expires: 2,
      qty: 5,
      target: '<jshaw>',
    },
    good: {
      expires: 2,
      qty: 5,
      target: '<jshaw>',
    },
    good2: {
      expires: 2,
      qty: 5,
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
  assert.is(state.balances['<jshaw>'], undefined);
  assert.is(state.pile.filter((v) => v === 'processed').length, 1);
});

test('should work with no requests TODO: udpate this test name', async () => {
  // set reward to 10
  const env = setupSmartWeaveEnv(999999, 10, '<tx>', undefined, 'ERROR', {});

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
  assert.is(toPairs(state.balances).length, 0);
  assert.is(state.pile.filter((v) => v === 'processed').length, 1);
});

test.after(async () => {});

test.run();
