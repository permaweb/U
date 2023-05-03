import arconnectWalletPNG from 'assets/arconnect-wallet-logo.png';
import arrowDownSVG from 'assets/arrow-down.svg';
import closeSVG from 'assets/close.svg';
import logoSVG from 'assets/logo.svg';
import menuSVG from 'assets/menu.svg';
import arweaveLogoSVG from 'assets/arweave-logo.svg';
import rebarLogoSVG from 'assets/rebar-logo.svg';

import { IURLView } from './types';
import { language } from './language';
import * as urls from './urls';

import { Swap } from 'views/Exchange/Swap';
import { Transfer } from 'views/Exchange/Transfer';

export const ASSETS = {
  arrowDown: arrowDownSVG,
  arweaveLogo: arweaveLogoSVG,
  close: closeSVG,
  logo: logoSVG,
  menu: menuSVG,
  rebarLogo: rebarLogoSVG,
  wallets: {
    arconnect: arconnectWalletPNG,
  },
};

export const DOM = {
  loader: 'loader',
  modal: 'modal',
  notification: 'notification',
};

export const URLS: IURLView = {
  exchange: [
    {
      label: language.swap,
      disabled: false,
      url: urls.swap,
      view: Swap,
    },
    {
      label: language.transfer,
      disabled: false,
      url: urls.transfer,
      view: Transfer,
    },
  ],
};

export const AR_WALLETS = [
  { name: 'arconnect', logo: ASSETS.wallets.arconnect },
];

export const WALLET_PERMISSIONS = [
  'ACCESS_ADDRESS',
  'ACCESS_PUBLIC_KEY',
  'SIGN_TRANSACTION',
  'DISPATCH',
];
