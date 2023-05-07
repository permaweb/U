import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { createMint } from '../src/write/create-mint.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('create-mint');

test.before(async () => {});

test('should create 1 mint request', async () => {
  const env = setupSmartWeaveEnv(
    1000000000000, // reward
    0, // height
    '<tx>'
  );

  const caller = '<justin>';
  const output = createMint(env)(
    {
      name: 'RebAR',
      mint_contract: '<mint-contract-2>',
      ticker: 'RebAR',
      balances: {},
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      claimable: [],
      divisibility: 6,
    },
    { caller }
  );
  const state = output.state;
  assert.is(state.requests['<tx>'].target, '<justin>');
  assert.is(state.requests['<tx>'].qty, 1000000);
  assert.is(state.requests['<tx>'].expires, 721);
});

test('should create a request for 0 if no reward is sent', async () => {
  const env = setupSmartWeaveEnv(
    999999, // reward
    0, // height
    '<tx>'
  );
  const output = createMint(env)(
    {
      name: 'RebAR',
      mint_contract: '<mint-contract-2>',
      ticker: 'RebAR',
      balances: {},
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      claimable: [],
      divisibility: 6,
    },
    { caller: '<justin>' }
  );

  const { state } = output;
  assert.is(state.requests['<tx>'].qty, 0);
});
test.after(async () => {});

test.run();
