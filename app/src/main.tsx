import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { App } from 'app';
import { GlobalStyle } from 'app/styles';
import { defaultTheme } from 'helpers/themes';
import { ArweaveProvider } from 'providers/ArweaveProvider';
import { ArweaveWalletKit } from 'arweave-wallet-kit';
import { WALLET_PERMISSIONS } from 'helpers/config';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={defaultTheme}>
      <ArweaveWalletKit
        config={{
          permissions: WALLET_PERMISSIONS,
          ensurePermissions: true,
          appInfo: {
            name: 'U',
            logo: 'https://kocmnja3z4bopl4uzdvzujcwtqkm3yyecr4r5ptqqvrq4mxu52ta.arweave.net/J3WXX4OGa6wP5E9oLhNyqlN4deYI7ARjrd5se740ftE',
          },
        }}
        theme
      >
        <ArweaveProvider>
          <HashRouter>
            <GlobalStyle />
            <App />
          </HashRouter>
        </ArweaveProvider>
      </ArweaveWalletKit>
    </ThemeProvider>
  </React.StrictMode>,
);
