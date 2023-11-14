import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { App } from 'app';
import { GlobalStyle } from 'app/styles';
import { defaultTheme } from 'helpers/themes';
import { ArweaveProvider } from 'providers/ArweaveProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={defaultTheme}>
      <ArweaveProvider>
        <HashRouter>
          <GlobalStyle />
          <App />
        </HashRouter>
      </ArweaveProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
