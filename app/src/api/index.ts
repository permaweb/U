import { getState } from './get-state';
import { burn } from './burn';
import { transfer } from './transfer';
import { claim } from './claim';
import { getPollingTx, pollMint } from './poll-mint';
import { getUBalance } from './get-u-balance';
export * from './interface';

export const env = {
  getState,
  burn,
  transfer,
  getUBalance,
  claim,
  pollMint,
  getPollingTx,
};
