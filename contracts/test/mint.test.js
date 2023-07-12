import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { mint } from '../src/write/mint.js';
import { setupSmartWeaveEnv } from './setup.js';
const test = suite('mint');

test.before(async () => {});

test('should mint 1 u', async () => {
  const env = setupSmartWeaveEnv(
    1000000000000, // reward
    0, // height
    '<tx>',
  );

  const caller = '<justin>';
  const output = mint(
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
    { caller },
  );
  const state = output.state;
  assert.is(state.balances[caller], 1000000);
});

test.after(async () => {});

test.run();
