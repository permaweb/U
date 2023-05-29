/**
 * @author @jshaw-ar
 * @export
 * @interface StateSEQ
 */
export interface State {
  ticker: string;
  name: string;
  settings: any[];
  claimable: Claimable[];
  divisibility: 1e6;
  balances: {
    [tx: string]: number;
  };
}

/**
 * @author @jshaw-ar
 * @interface Claimable
 */
export interface Claimable {
  to: string;
  from: string;
  txID: string;
  qty: number;
}
