import styled, { DefaultTheme } from 'styled-components';

import { fadeIn1, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';
import { NotificationType } from 'helpers/types';

export const Wrapper = styled.div`
  height: 55px;
  width: 300px;
  max-width: 90vw;
  background: ${(props) => props.theme.colors.container.primary.background};
  border: 1px solid ${(props) => props.theme.colors.border.alt1};
  border-radius: ${STYLING.dimensions.borderRadiusWrapper};
  box-shadow: 0 0 2.5px ${(props) => props.theme.colors.shadow.primary};
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 12;
  animation: ${open} ${fadeIn1};
  display: flex;
  align-items: center;
  @media (max-width: ${STYLING.cutoffs.initial}) {
    left: 50%;
    transform: translate(-50%, 0);
  }
`;

export const Message = styled.span<{ type: NotificationType }>`
  color: ${(props) => props.theme.colors.font.primary.active.base};
  font-weight: ${(props) => props.theme.typography.weight.regular};
  margin-left: 20px;
  padding-left: 7.5px;
`;

export const Close = styled.div`
  height: 100%;
  width: 50px;
  position: absolute;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5px 0 0 0;
`;
