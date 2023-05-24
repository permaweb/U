import arconnectWalletPNG from 'assets/arconnect-wallet-logo.png';
import arrowDownSVG from 'assets/arrow-down.svg';
import checkmarkSVG from 'assets/checkmark.svg';
import closeSVG from 'assets/close.svg';
import infoSVG from 'assets/info.svg';
import logoSVG from 'assets/logo.svg';
import menuSVG from 'assets/menu.svg';
import arweaveLogoSVG from 'assets/arweave-logo.svg';
import rebarLogoSVG from 'assets/rebar-logo.svg';

import { IURLView } from './types';
import { language } from './language';
import * as urls from './urls';

import { Burn } from 'views/Exchange/Burn';
import { Transfer } from 'views/Exchange/Transfer';
import { Claim } from 'views/Exchange/Claim';

export const ASSETS = {
  arrowDown: arrowDownSVG,
  arweaveLogo: arweaveLogoSVG,
  checkmark: checkmarkSVG,
  close: closeSVG,
  info: infoSVG,
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
      label: language.burn,
      disabled: false,
      url: urls.burn,
      view: Burn,
    },
    {
      label: language.transfer,
      disabled: false,
      url: urls.transfer,
      view: Transfer,
    },
    {
      label: language.claim,
      disabled: false,
      url: urls.claim,
      view: Claim,
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
