import { createGlobalStyle } from 'styled-components';

import { STYLING } from 'helpers/styling';

export const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  body {
    line-height: 1;
    background: ${(props) => props.theme.colors.view.background};
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
    content: none;
  }

  html, body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
    font-family: ${(props) => props.theme.typography.family.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
  

  a {
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
    &:focus {
      outline: 0;
    }
  }

  h1 {
    font-size: ${(props) => props.theme.typography.size.h1};
    font-family: ${(props) => props.theme.typography.family.alt1};
  }

  h2 {
    font-size: ${(props) => props.theme.typography.size.h2};
  }

  b {
    font-weight: ${(props) => props.theme.typography.weight.medium};
  }
  
  p, span, button, a, b, li, input, textarea {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
    font-family: ${(props) => props.theme.typography.family.primary};
    font-size: ${(props) => props.theme.typography.size.small};
    color: ${(props) => props.theme.colors.font.primary.alt1};
  }

  button {
    font-size: ${(props) => props.theme.typography.size.xSmall};
    font-weight: ${(props) => props.theme.typography.weight.medium};
  }

  a {
    color: ${(props) => props.theme.colors.font.primary.active.base};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-decoration-thickness: 1.215px;
    }
    &:focus {
      text-decoration: underline;
    }
  }
  
  button {
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    transition: background .1s;

    &:hover {
      cursor: pointer;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  input, textarea {
    box-shadow: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: ${(props) => props.theme.colors.form.background};
    border: 1px solid ${(props) => props.theme.colors.form.border};
    color: ${(props) => props.theme.colors.font.primary.alt1};
    margin: 0;
    padding: 10px;
    &:disabled {
      cursor: not-allowed;
    }
  }

  input {
    padding: 10px 15px;
  }

  input[type=number]::-webkit-inner-spin-button {
    opacity: 0;
  }

  textarea {
    resize: none;
    height: 170px;
  }

  .exchange-wrapper {
    width: 500px !important;
    max-width: 90vw !important;
    margin: 50px auto 0 auto !important;
    padding: 0 0 50px !important;
  }

  .tab-wrapper {
    min-height: 540px;
    width: 100%;
    padding: 40px;
    background: ${(props) => props.theme.colors.container.primary.background};
    border-bottom-left-radius: ${STYLING.dimensions.borderRadius};
    border-bottom-right-radius: ${STYLING.dimensions.borderRadius};
    border-left: 1px solid ${(props) => props.theme.colors.border.primary};
    border-right: 1px solid ${(props) => props.theme.colors.border.primary};
    border-bottom: 1px solid ${(props) => props.theme.colors.border.primary};
    @media(max-width: ${STYLING.cutoffs.secondary}) {
      padding: 20px;
    }
  }

  .border-wrapper {
    background: ${(props) => props.theme.colors.container.primary.background};
    border-radius: ${STYLING.dimensions.borderRadius};
    border: 1px solid ${(props) => props.theme.colors.border.primary};
  }
`;
