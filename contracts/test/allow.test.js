import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { allow } from '../src/write/allow.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('allow');

test.before(() => {});

test('should throw (Please specify a target.)', () => {
  const caller = '<justin>';
  const env = setupSmartWeaveEnv();

  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {},
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {},
          claimable: [],
          divisibility: 1e6,
        },
        { caller }
      ),
    /Please specify a target./
  );
});

test('should throw (Target cannot be caller.)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {},
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: caller } }
      ),
    /Target cannot be caller./
  );
});

test('should throw (qty must be an integer.)', async () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {},
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>' } }
      ),
    /qty must be an integer./
  );
});

test('should throw (qty must be an integer.)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>' } }
      ),
    /qty must be an integer./
  );
});

test('should throw (Not enough tokens for allow.)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>', qty: 11 } }
      ),
    /Not enough tokens for transfer./
  );
});

test('should not allow null amount of tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>', qty: null } }
      ),
    /qty must be an integer./
  );
});

test('should not allow without providing quantity', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>' } }
      ),
    /qty must be an integer./
  );
});

test('should not transfer corrupted amount of tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>', qty: 'xxx' } }
      ),
    /qty must be an integer./
  );
});

test('should not allow fractional value', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>', qty: 9.8 } }
      ),
    /qty must be an integer./
  );
});
test('should not allow without a target', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 10 } }
      ),
    /Please specify a target./
  );
});

test('should not allow with null target', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 10, target: null } }
      ),
    /Please specify a target./
  );
});

test('should not allow with undefined target', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 10, target: undefined } }
      ),
    /Please specify a target./
  );
});

test('should not transfer negative amount of tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: -1, target: '<tom>' } }
      ),
    /Invalid token transfer. qty must be an integer greater than 0./
  );
});

test('should not transfer 0 tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 0, target: '<tom>' } }
      ),
    /Invalid token transfer. qty must be an integer greater than 0./
  );
});

test('should not transfer to the same account', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 0, target: caller } }
      ),
    /Target cannot be caller./
  );
});

test('should not transfer to the same account', () => {
  const caller = '<justin>';

  const env = setupSmartWeaveEnv(
    undefined,
    undefined,
    '<tx>',
    undefined,
    undefined,
    undefined
  );

  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          balances: {
            [caller]: 10,
          },
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],

          claimable: [],
          divisibility: 1e6,
        },
        { caller: '<non-existing>', input: { qty: 5, target: '<tom>' } }
      ),
    /Not enough tokens for transfer./
  );
});

test('should not transfer more than owned', () => {
  const caller = '<justin>';

  const env = setupSmartWeaveEnv(
    undefined,
    undefined,
    '<tx>',
    undefined,
    undefined,
    undefined,
    { [caller]: 10 }
  );
  assert.throws(
    () =>
      allow(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {},
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 11, target: '<tom>' } }
      ),
    /Not enough tokens for transfer./
  );
});

test('should transfer to empty account', async () => {
  const env = setupSmartWeaveEnv(
    undefined,
    undefined,
    '<tx>',
    undefined,
    undefined,
    undefined
  );
  const caller = '<justin>';
  const output = await allow(
    {
      name: 'U',
      ticker: 'U',
      balances: {
        [caller]: 10,
      },
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      claimable: [],
      divisibility: 1e6,
    },
    { caller, input: { target: '<tom>', qty: 10 } }
  );

  const { state } = output;
  assert.equal(state.balances['<justin>'], 0);
  assert.equal(state.claimable[0]?.txID, '<tx>');
  assert.equal(state.claimable[0]?.to, '<tom>');
  assert.equal(state.claimable[0]?.qty, 10);
});

test('should allow to existing account', async () => {
  const caller = '<justin>';
  const env = setupSmartWeaveEnv(
    undefined,
    undefined,
    '<tx>',
    undefined,
    undefined,
    undefined
  );
  const output = await allow(
    {
      name: 'U',
      ticker: 'U',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      balances: {
        [caller]: 10,
        '<tom>': 10,
      },
      claimable: [],
      divisibility: 1e6,
    },
    { caller, input: { target: '<tom>', qty: 10 } }
  );

  const { state } = output;
  assert.equal(state.balances[caller], 0);
  assert.equal(state.claimable[0]?.to, '<tom>');
  assert.equal(state.claimable[0]?.qty, 10);
  assert.equal(state.claimable[0]?.qty + state.balances['<tom>'], 20);
});

test.after(async () => {});

test.run();
