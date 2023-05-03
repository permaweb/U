/**
 * @author @jshaw-ar
 * @export
 * @interface StateSEQ
 */
export interface StateSEQ {
  ticker: string;
  name: string;
  balances: {
    [address: string]: number;
  };
  settings: any[];
  claimable: Claimable[];
  divisibility: 6;
  pile: string[];
}

/**
 * @author @jshaw-ar
 * @interface Claimable
 */
interface Claimable {
  to: string;
  from: string;
  txID: string;
  qty: number;
}

/**
 * @author @jshaw-ar
 * @export
 * @interface StateL1
 */
export interface StateL1 {
  ticker: string;
  name: string;
  settings: any[];
  requests: {
    [tx: string]: MintRequest;
  };
}

/**
 * @author @jshaw-ar
 * @interface MintRequest
 */
export interface MintRequest {
  target: string;
  qty: number;
  expires: number;
}
