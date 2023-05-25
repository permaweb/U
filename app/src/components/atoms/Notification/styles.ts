import styled, { DefaultTheme } from 'styled-components';

import { fadeIn1, open } from 'helpers/animations';
import { STYLING } from 'helpers/styling';
import { NotificationType } from 'helpers/types';

function getColor(m: NotificationType, theme: DefaultTheme) {
  switch (m) {
    case 'success':
      return theme.colors.notification.success;
    case 'warning':
      return theme.colors.notification.warning;
    case 'neutral':
      return theme.colors.notification.neutral;
    default:
      return theme.colors.notification.neutral;
  }
}

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

export const Message = styled.span`
  color: ${(props) => props.theme.colors.font.primary.active.base};
  font-weight: ${(props) => props.theme.typography.weight.regular};
  margin-left: 20px;
  padding-left: 7.5px;
`;

export const Icon = styled.div<{ type: NotificationType }>`
  height: 25px;
  width: 25px;
  background: ${(props) => getColor(props.type, props.theme)};
  border-radius: 50%;
  margin: 0 0 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    padding: 2.5px 0 0 0;
    height: 15px;
    width: 15px;
  }
`;

export const Close = styled.div`
  height: 100%;
  width: 50px;
  position: absolute;
  top: 5px;
  right: 10px;
  display: flex;
  justify-content: flex-end;
  padding: 1.5px 0 0 0;
  button {
    height: 10px !important;
    width: 10px !important;
    svg {
      height: 10px !important;
      width: 10-px !important;
    }
  }
`;
