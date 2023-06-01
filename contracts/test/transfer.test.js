import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { transfer } from '../src/write/transfer.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('transfer');

test.before(async () => {
  // This is needed for ContractError to work
  setupSmartWeaveEnv();
});

test('should throw (Please specify a target.)', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10000000,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller }
      ),
    /Please specify a target./
  );
});

test('should throw (Target cannot be caller.)', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10000000,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: caller } }
      ),
    /Target cannot be caller./
  );
});

test('should throw (Not enough tokens for transfer.)', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
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
        { caller, input: { target: 'tom', qty: 5 } }
      ),
    /Not enough tokens for transfer./
  );
});

test('should throw (qty must be an integer.)', () => {
  const caller = '<justin>';

  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10000000,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>' } }
      ),
    /qty must be an integer./
  );
});

test('should throw (Not enough tokens for transfer.)', () => {
  const caller = '<justin>';

  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>', qty: 11 } }
      ),
    /Not enough tokens for transfer./
  );
});

test('should not transfer null amount of tokens', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
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
        { caller, input: { target: '<tom>', qty: null } }
      ),
    /qty must be an integer./
  );
});

test('should not transfer undefined amount of tokens', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10000000,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>' } }
      ),
    /qty must be an integer./
  );
});

test("should not transfer 'string' amount of tokens", () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
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
        { caller, input: { target: '<tom>', qty: 'xxx' } }
      ),
    /qty must be an integer./
  );
});

test('should not transfer fractional amount of tokens', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10000000,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { target: '<tom>', qty: 199999.01 } }
      ),
    /qty must be an integer./
  );
});

test('should not transfer without a target', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10000000,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 1000000 } }
      ),
    /Please specify a target./
  );
});

test('should not transfer with null target', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10000000,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 1000000, target: null } }
      ),
    /Please specify a target./
  );
});

test('should not transfer with undefined target', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10000000,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 1000000, target: undefined } }
      ),
    /Please specify a target./
  );
});

test('should not transfer from non-existing account (in kv store)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
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
        { caller: '<non-existing>', input: { qty: 1000000, target: '<tom>' } }
      ),
    /Not enough tokens for transfer./
  );
});

test('should not transfer more than owned', () => {
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 1999999,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 2000000, target: '<tom>' } }
      ),
    /Not enough tokens for transfer./
  );
});

test('should not transfer 0 tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10000000,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 0, target: '<tom>' } }
      ),
    /Invalid token transfer. qty must be an integer greater than 0./
  );
});

test('should not transfer negative amount of tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';

  assert.throws(
    () =>
      transfer(
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
        { caller, input: { qty: -1, target: '<tom>' } }
      ),
    /Invalid token transfer. qty must be an integer greater than 0./
  );
});

test('should not transfer to the same account (caller -> caller)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  assert.throws(
    () =>
      transfer(
        {
          name: 'U',
          ticker: 'U',
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          balances: {
            [caller]: 10000000,
          },
          claimable: [],
          divisibility: 1e6,
        },
        { caller, input: { qty: 1000000, target: caller } }
      ),
    /Target cannot be caller./
  );
});

test('should transfer to empty account', () => {
  const caller = '<justin>';
  const output = transfer(
    {
      name: 'U',
      ticker: 'U',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      balances: {
        [caller]: 10000000,
      },
      claimable: [],
      divisibility: 1e6,
    },
    { caller, input: { target: '<tom>', qty: 10 } }
  );
  const { state } = output;
  assert.equal(state.balances['<tom>'], 10);
  assert.equal(state.balances[caller], 10000000 - 10);
});

test('should transfer to existing account', async () => {
  const caller = '<justin>';

  const output = transfer(
    {
      name: 'U',
      ticker: 'U',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      balances: {
        [caller]: 20,
        ['<tom>']: 1,
      },
      claimable: [],
      divisibility: 1e6,
    },
    { caller, input: { target: '<tom>', qty: 10 } }
  );

  const { state } = output;

  assert.equal(state.balances[caller], 10);
  assert.equal(state.balances['<tom>'], 11);
});

// test.after(async () => {});

test.run();
