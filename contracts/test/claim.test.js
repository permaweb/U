import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { claim } from '../src/write/claim.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('claim');

test.before(() => {
  setupSmartWeaveEnv();
});

test('should not allow claiming without txId', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      claim(
        {
          name: 'U',
          ticker: 'U',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller }
      ),
    /txID must be passed to the claim function./
  );
});

test('should not allow claiming with null txID', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      claim(
        {
          name: 'U',
          ticker: 'U',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { txID: null } }
      ),
    /txID must be passed to the claim function./
  );
});

test('should not allow claiming with non-existing txID', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      claim(
        {
          name: 'U',
          ticker: 'U',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { txID: '<test-claim>', qty: 1 } }
      ),
    /There must be 1 claimable with this tx id./
  );
});

test('should throw (Claim not addressed to caller.)', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      claim(
        {
          name: 'U',
          ticker: 'U',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [
            {
              txID: '<test-claim>',
              to: '<tom>',
            },
          ],
          divisibility: 1e6,
        },
        { caller, input: { txID: '<test-claim>', qty: 1 } }
      ),
    /Claim not addressed to caller./
  );
});

test('should throw (Incorrect qty.)', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      claim(
        {
          name: 'U',
          ticker: 'U',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [
            {
              txID: '<test-claim>',
              to: caller,
              qty: 11,
            },
          ],
          divisibility: 1e6,
        },
        { caller, input: { txID: '<test-claim>', qty: 10 } }
      ),
    /Incorrect qty./
  );
});

test('should throw (Incorrect qty.)', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      claim(
        {
          name: 'U',
          ticker: 'U',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [
            {
              txID: '<test-claim>',
              to: caller,
              qty: 11,
            },
          ],
          divisibility: 1e6,
        },
        { caller, input: { txID: '<test-claim>' } }
      ),
    /A qty must be specified./
  );
});

test('should not allow claiming with null quantity', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      claim(
        {
          name: 'U',
          ticker: 'U',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [
            {
              txID: '<test-claim>',
              to: caller,
              qty: 11,
            },
          ],
          divisibility: 1e6,
        },
        { caller, input: { txID: '<test-claim>', qty: null } }
      ),
    /A qty must be specified./
  );
});

test('should not allow claiming with incorrect quantity', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      claim(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            '<tom>': 11,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [
            {
              from: '<tom>',
              txID: '<test-claim>',
              to: caller,
              qty: 11,
            },
          ],
          divisibility: 1e6,
        },
        { caller, input: { txID: '<test-claim>', qty: 10 } }
      ),
    /Incorrect qty./
  );
});

test('should not allow claiming with null quantity', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      claim(
        {
          name: 'U',
          ticker: 'U',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [
            {
              txID: '<test-claim>',
              to: caller,
              qty: 11,
            },
          ],
          divisibility: 1e6,
        },
        { caller: '<incorrect>', input: { txID: '<test-claim>', qty: 11 } }
      ),
    /Claim not addressed to caller./
  );
});

test('should claim tokens', async () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  const output = await claim(
    {
      name: 'U',
      ticker: 'U',
      balances: {},
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      claimable: [
        {
          txID: '<test-claim3>',
          to: caller,
          qty: 11,
          from: '<tom>',
        },
        {
          txID: '<test-claim2>',
          to: caller,
          qty: 11,
          from: '<tom>',
        },
        {
          txID: '<test-claim>',
          to: caller,
          qty: 11,
          from: '<tom>',
        },
      ],
      divisibility: 1e6,
    },
    { caller, input: { txID: '<test-claim>', qty: 11 } }
  );

  const { state } = output;
  assert.is(state.claimable.length, 2);
  assert.is(state.balances['<justin>'], 11);
});

test.after(async () => {});

test.run();
