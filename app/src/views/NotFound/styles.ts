import styled from 'styled-components';

import { STYLING } from 'helpers/styling';

export const Wrapper = styled.div`
  height: calc(100vh - ${STYLING.dimensions.navHeight});
  width: 100%;
  position: relative;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const Header = styled.h2`
  font-size: 28px;
`;

export const Divider = styled.div`
  height: 32px;
  width: 1px;
  margin: 0 22.5px;
  border-right: 1px solid ${(props) => props.theme.colors.font.primary.alt1};
`;

export const Message = styled.p`
  font-size: 18px;
  margin-right: 10px;
`;
