import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { allow } from '../src/write/allow.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('allow');

test.before(async () => {});

test('should throw (Please specify a target.)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
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
      ),
    /Please specify a target./
  );
});

test('should throw (Target cannot be caller.)', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
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
        { caller, input: { target: caller } }
      ),
    /Target cannot be caller./
  );
});

test('should throw (Caller does not have a balance.)', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
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
      ),
    /Caller does not have a balance./
  );
});

test('should throw (qty must be an integer.)', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
      ),
    /qty must be an integer./
  );
});

test('should throw (Not enough tokens for allow.)', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { target: '<tom>', qty: 11 } }
      ),
    /Not enough tokens for allow./
  );
});

test('should not allow null amount of tokens', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { target: '<tom>', qty: null } }
      ),
    /qty must be an integer./
  );
});

test('should not allow without providing quantity', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
      ),
    /qty must be an integer./
  );
});

test('should not transfer corrupted amount of tokens', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { target: '<tom>', qty: 'xxx' } }
      ),
    /qty must be an integer./
  );
});

test('should not allow fractional value', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { target: '<tom>', qty: 9.8 } }
      ),
    /qty must be an integer./
  );
});
test('should not allow without a target', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { qty: 10 } }
      ),
    /Please specify a target./
  );
});

test('should not allow with null target', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { qty: 10, target: null } }
      ),
    /Please specify a target./
  );
});

test('should not allow with undefined target', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { qty: 10, target: undefined } }
      ),
    /Please specify a target./
  );
});

test('should not transfer negative amount of tokens', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { qty: -1, target: '<tom>' } }
      ),
    /Invalid token transfer. qty must be an integer greater than 0./
  );
});

test('should not transfer 0 tokens', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { qty: 0, target: '<tom>' } }
      ),
    /Invalid token transfer. qty must be an integer greater than 0./
  );
});

test('should not transfer to the same account', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { qty: 0, target: caller } }
      ),
    /Target cannot be caller./
  );
});

test('should not transfer to the same account', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller: '<non-existing>', input: { qty: 5, target: '<tom>' } }
      ),
    /Caller does not have a balance./
  );
});

test('should not transfer more than owned', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      allow(
        {
          name: 'RebAR',
          ticker: 'RebAR',
          balances: {
            [caller]: 10,
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
        { caller, input: { qty: 11, target: '<tom>' } }
      ),
    /Not enough tokens for allow./
  );
});

test('should transfer to empty account', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  const output = allow(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      owner: '',
      balances: {
        [caller]: 10,
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
    { caller, input: { target: '<tom>', qty: 10 } }
  );

  const { state } = output;
  assert.equal(state.balances[caller], 0);
  assert.equal(state.claimable[0]?.to, '<tom>');
  assert.equal(state.claimable[0]?.qty, 10);
});

test('should allow to existing account', () => {
  setupSmartWeaveEnv();
  const caller = '<justin>';
  const output = allow(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      owner: '',
      balances: {
        [caller]: 10,
        '<tom>': 10,
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
