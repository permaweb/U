import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { balance } from '../src/read/balance.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('balance');

test.before(async () => {});

test('caller should have 0 balance', async () => {
  // set reward to 10
  setupSmartWeaveEnv(999999);

  const caller = '<justin>';
  const output = await balance(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      owner: '',
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
    { caller }
  );
  assert.is(output.result.balance, 0);
  assert.is(output.result.target, caller);
});

test('caller should have 1 balance', async () => {
  // set reward to 10
  setupSmartWeaveEnv(999999);

  const caller = '<justin>';
  const output = await balance(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      owner: '',
      balances: {
        '<justin>': 1,
      },
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      claimable: [],
      divisibility: 6,
      whitelist: [],
      killswitch: false,
    },
    { caller }
  );
  assert.is(output.result.balance, 1);
  assert.is(output.result.target, caller);
});

test('target should have 0 balance', async () => {
  // set reward to 10
  setupSmartWeaveEnv(999999);

  const caller = '<justin>';
  const output = await balance(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      owner: '',
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
    { caller, input: { target: '<tom>' } }
  );
  assert.is(output.result.balance, 0);
  assert.is(output.result.target, '<tom>');
});
test('target should have 1 balance', async () => {
  // set reward to 10
  setupSmartWeaveEnv(999999);

  const caller = '<justin>';
  const output = await balance(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      owner: '',
      balances: {
        '<tom>': 1,
      },
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      claimable: [],
      divisibility: 6,
      whitelist: [],
      killswitch: false,
    },
    { caller, input: { target: '<tom>' } }
  );
  assert.is(output.result.balance, 1);
  assert.is(output.result.target, '<tom>');
});

test.after(async () => {});

test.run();
