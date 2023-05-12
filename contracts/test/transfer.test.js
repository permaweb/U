import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { transfer } from '../src/write/transfer.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('transfer');

// test.before(async () => {});

test('should throw (Please specify a target.)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller }
  ).catch((e) => {
    assert.equal(e.message, 'Please specify a target.');
  });
});

test('should throw (Target cannot be caller.)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: caller } }
  ).catch((e) => {
    assert.equal(e.message, 'Target cannot be caller.');
  });
});

test('should throw (Not enough tokens for transfer.)', () => {
  const newENv = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(newENv)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: 'tom', qty: 5 } }
  ).catch((e) => {
    assert.is(e.message, 'Error: Not enough tokens for transfer.');
  });
});

test('should throw (qty must be an integer.)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: '<tom>' } }
  ).catch((e) => {
    assert.equal(e.message, 'qty must be an integer.');
  });
});

test('should throw (Not enough tokens for transfer.)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: '<tom>', qty: 11 } }
  ).catch((e) => {
    assert.is(e.message, 'Error: Not enough tokens for transfer.');
  });
});

test('should not transfer null amount of tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: '<tom>', qty: null } }
  ).catch((e) => {
    assert.equal(e.message, 'qty must be an integer.');
  });
});

test('should not transfer undefined amount of tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: '<tom>' } }
  ).catch((e) => {
    assert.equal(e.message, 'qty must be an integer.');
  });
});

test("should not transfer 'string' amount of tokens", () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: '<tom>', qty: 'xxx' } }
  ).catch((e) => {
    assert.equal(e.message, 'qty must be an integer.');
  });
});

test('should not transfer fractional amount of tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: '<tom>', qty: 199999.01 } }
  ).catch((e) => {
    assert.equal(e.message, 'qty must be an integer.');
  });
});

test('should not transfer without a target', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';

  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { qty: 1000000 } }
  ).catch((e) => {
    assert.equal(e.message, 'Please specify a target.');
  });
});

test('should not transfer with null target', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';

  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { qty: 1000000, target: null } }
  ).catch((e) => {
    assert.equal(e.message, 'Please specify a target.');
  });
});

test('should not transfer with undefined target', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';

  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { qty: 1000000, target: undefined } }
  ).catch((e) => {
    assert.equal(e.message, 'Please specify a target.');
  });
});

test('should not transfer from non-existing account (in kv store)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller: '<non-existing>', input: { qty: 1000000, target: '<tom>' } }
  ).catch((e) => {
    assert.is(e.message, 'Error: Not enough tokens for transfer.');
  });
});

test('should not transfer more than owned', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { qty: 2000000, target: '<tom>' } }
  ).catch((e) => {
    assert.is(e.message, 'Error: Not enough tokens for transfer.');
  });
});

test('should not transfer 0 tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { qty: 0, target: '<tom>' } }
  ).catch((e) => {
    assert.equal(
      e.message,
      'Invalid token transfer. qty must be an integer greater than 0.'
    );
  });
});

test('should not transfer negative amount of tokens', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { qty: -1, target: '<tom>' } }
  ).catch((e) => {
    assert.equal(
      e.message,
      'Invalid token transfer. qty must be an integer greater than 0.'
    );
  });
});

test('should not transfer to the same account (caller -> caller)', () => {
  const env = setupSmartWeaveEnv();
  const caller = '<justin>';
  transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],

      claimable: [],
      divisibility: 6,
    },
    { caller, input: { qty: 1000000, target: caller } }
  ).catch((e) => {
    assert.equal(e.message, 'Target cannot be caller.');
  });
});

test('should transfer to empty account', async () => {
  const caller = '<justin>';
  const env = setupSmartWeaveEnv(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { [caller]: 20 }
  );
  await transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: '<tom>', qty: 10 } }
  );
  assert.equal(await env.kv.get('<tom>'), 10);
});

test('should transfer to existing account', async () => {
  const caller = '<justin>';
  const env = setupSmartWeaveEnv(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { [caller]: 20, '<tom>': 1 }
  );
  await transfer(env)(
    {
      name: 'RebAR',
      ticker: 'RebAR',
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      claimable: [],
      divisibility: 6,
    },
    { caller, input: { target: '<tom>', qty: 10 } }
  );

  assert.equal(await env.kv.get(caller), 10);
  assert.equal(await env.kv.get('<tom>'), 11);
});

// test.after(async () => {});

test.run();
