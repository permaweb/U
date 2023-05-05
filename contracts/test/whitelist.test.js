import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { add, remove } from '../src/write/whitelist.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('whitelist');

test.before(async () => {});

test('remove - should throw Only owner.', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      remove(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          owner: '<not-justin>',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          claimable: [],
          divisibility: 6,
          whitelist: [],
          killswitch: false,
        },
        { caller, input: { function: 'remove' } }
      ),
    /Only owner./
  );
});

test('remove - Please specify an address.', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      remove(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          owner: '<justin>',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 6,
          whitelist: [],
          killswitch: false,
        },
        { caller, input: { function: 'remove' } }
      ),
    /Please specify an address./
  );
});

test('remove - should kill', () => {
  const caller = '<justin>';
  const output = remove(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      owner: '<justin>',
      balances: {},
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
      whitelist: ['<test>', '<justin>'],
      killswitch: false,
    },
    { caller, input: { function: 'remove', addr: '<test>' } }
  );

  const { state } = output;
  assert.is(state.whitelist.length, 1);
  assert.is(state.whitelist[0], '<justin>');
});

test('add - should throw Only owner.', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      add(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          owner: '<not-justin>',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          claimable: [],
          divisibility: 6,
          whitelist: [],
          killswitch: false,
        },
        { caller, input: { function: 'add', addr: '<some-addr>' } }
      ),
    /Only owner./
  );
});

test('add - should throw Cannot add owner.', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      add(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          owner: '<justin>',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          claimable: [],
          divisibility: 6,
          whitelist: [],
          killswitch: false,
        },
        { caller, input: { function: 'add', addr: '<justin>' } }
      ),
    /Cannot add owner./
  );
});

test('add - Please specify an address.', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      add(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          owner: '<justin>',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 6,
          whitelist: [],
          killswitch: false,
        },
        { caller, input: { function: 'add' } }
      ),
    /Please specify an address./
  );
});

test('add - should add <test>', () => {
  const caller = '<justin>';
  const output = add(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      owner: '<justin>',
      balances: {},
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
      whitelist: ['<justin>'],
      killswitch: false,
    },
    { caller, input: { function: 'add', addr: '<test>' } }
  );

  const { state } = output;
  assert.is(state.whitelist.includes('<test>'), true);
});

test.after(async () => {});

test.run();
