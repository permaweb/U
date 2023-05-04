import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { rejectClaimable } from '../src/write/reject.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('reject');

test.before(async () => {});

test('should throw txID must be passed to the reject function.', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      rejectClaimable(
        {
          name: 'RebAR',
          ticker: 'RebAR',
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
          divisibility: 6,
        },
        { caller, input: { function: 'reject' } }
      ),
    /txID must be passed to the reject function./
  );
});

test('should throw Claim not addressed to caller.', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      rejectClaimable(
        {
          name: 'RebAR',
          ticker: 'RebAR',
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
          divisibility: 6,
        },
        { caller, input: { function: 'reject', tx: '<reject-tx>' } }
      ),
    /Claim not addressed to caller./
  );
});

test('should throw Claim does not exist.', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      rejectClaimable(
        {
          name: 'RebAR',
          ticker: 'RebAR',
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
          divisibility: 6,
        },
        { caller, input: { function: 'reject', tx: '<not-exist>' } }
      ),
    /Claim does not exist./
  );
});

test('should reject tokens', () => {
  setupSmartWeaveEnv();
  const caller = '<some-contract>';
  const output = rejectClaimable(
    {
      name: 'RebAR',
      ticker: 'RebAR',
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
      divisibility: 6,
    },
    { caller, input: { function: 'reject', tx: '<reject-tx>' } }
  );

  const { state } = output;
  assert.is(state.balances['<justin>'], 5);
  assert.is(state.claimable.length, 0);
});

test.after(async () => {});

test.run();
