import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { rejectClaimable } from '../src/write/reject.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('reject');

test.before(() => {
  setupSmartWeaveEnv();
});

test('should throw txID must be passed to the reject function.', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      rejectClaimable(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            '<jshaw>': 0,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [
            {
              txID: '<reject-tx>',
              to: '<some-contract>',
              from: '<jshaw>',
              qty: 5,
            },
          ],
          divisibility: 1e6,
        },
        { caller, input: { function: 'reject' } }
      ),
    /txID must be passed to the reject function./
  );
});

test('should throw Claim not addressed to caller.', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      rejectClaimable(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            '<justin>': 0,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [
            {
              txID: '<reject-tx>',
              to: '<some-contract>',
              from: '<justin>',
              qty: 5,
            },
          ],
          divisibility: 1e6,
        },
        { caller, input: { function: 'reject', tx: '<reject-tx>' } }
      ),
    /Claim not addressed to caller./
  );
});

test('should throw Claim does not exist.', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      rejectClaimable(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            '<jshaw>': 0,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [
            {
              txID: '<reject-tx>',
              to: '<some-contract>',
              from: '<jshaw>',
              qty: 5,
            },
          ],
          divisibility: 1e6,
        },
        { caller, input: { function: 'reject', tx: '<not-exist>' } }
      ),
    /There must be 1 claimable with this tx id./
  );
});

test('should reject tokens', async () => {
  const caller = '<some-contract>';
  const output = await rejectClaimable(
    {
      name: 'U',
      ticker: 'U',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      balances: {},
      claimable: [
        {
          txID: '<reject-tx>',
          to: '<some-contract>',
          from: '<justin>',
          qty: 5,
        },
      ],
      divisibility: 1e6,
    },
    { caller, input: { function: 'reject', tx: '<reject-tx>' } }
  );

  const { state } = output;
  assert.is(state.balances['<justin>'], 5);
  assert.is(state.claimable.length, 0);
});

test.run();
