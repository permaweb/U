import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { getQueue } from '../src/read/get-queue.js';
import { setupSmartWeaveEnv } from './setup.js';

const test = suite('get-queue');

test.before(async () => {});

test('should return requests 2', async () => {
  // set reward to 10
  setupSmartWeaveEnv(999999, 1, '<tx>', undefined, 'ERROR', []);

  const caller = '<justin>';

  const queue = getQueue(
    {
      // STATE STUBBED WITH 2 REQUESTS
      requests: [
        { tx: 'one', qty: 5, target: '<justin>', expires: 5 },
        { tx: 'two', qty: 5, target: '<tom>', expires: 5 },
      ],
    },
    { caller }
  ).result;
  const one = queue.filter((r) => r.tx === 'one')[0];
  const two = queue.filter((r) => r.tx === 'two')[0];
  assert.is(one.target, '<justin>');
  assert.is(two.target, '<tom>');
  assert.is(queue.length, 2);
});

test.after(async () => {});

test.run();
