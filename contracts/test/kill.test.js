import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { kill } from '../src/write/kill.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('kill');

test.before(async () => {});

test('should throw Only owner.', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      kill(
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
        { caller, input: { function: 'kill' } }
      ),
    /Only owner./
  );
});

test('should kill', () => {
  const caller = '<justin>';
  const output = kill(
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
      killswitch: false,
    },
    { caller, input: { function: 'kill' } }
  );

  const { state } = output;
  assert.is(state.killswitch, true);
  assert.is(state.claimable.length, 0);
});

test.after(async () => {});

test.run();
