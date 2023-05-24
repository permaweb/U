import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.main`
  min-height: calc(100vh - ${STYLING.dimensions.navHeight});
  width: 100%;
  margin: ${STYLING.dimensions.navHeight} auto 0 auto;
  position: relative;
  border: 1px solid transparent;
`;

export const FAQWrapper = styled.div`
  width: 100%;
  max-width: ${(STYLING.cutoffs.max)};
  margin: 40px auto 0 auto;
  padding: 0 25px;
`;