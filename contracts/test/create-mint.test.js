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
      requests: [],
      settings: [
        ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
        ['isTradeable', true],
      ],
      claimable: [],
      divisibility: 1e6,
    },
    { caller }
  );
  const state = output.state;
  const tx = state.requests.filter((r) => r.tx === '<tx>')[0];
  assert.is(tx.target, '<justin>');
  assert.is(tx.qty, 1000000);
  assert.is(tx.expires, 721);
});

test('should throw You must mint at least 100 feron.', () => {
  const env = setupSmartWeaveEnv(
    999999, // reward
    0, // height
    '<tx>'
  );
  assert.throws(
    () =>
      createMint(env)(
        {
          name: 'RebAR',
          mint_contract: '<mint-contract-2>',
          ticker: 'RebAR',
          balances: {},
          requests: [],
          settings: [
            ['communityLogo', '_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo'],
            ['isTradeable', true],
          ],
          claimable: [],
          divisibility: 1e6,
        },
        { caller: '<justin>' }
      ),
    /You must mint at least 100 feron./
  );
});
test.after(async () => {});

test.run();
