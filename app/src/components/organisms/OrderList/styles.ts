import styled, { DefaultTheme } from 'styled-components';

import { STYLING } from 'helpers/styling';
import { MintStatusType } from 'helpers/types';

function getDetailLineBackground(type: MintStatusType, theme: DefaultTheme) {
  switch (type) {
    case 'confirmed':
      return theme.colors.orderLine.confirmed.background;
    case 'pending':
      return theme.colors.orderLine.pending.background;
    default:
      return theme.colors.orderLine.default.background;
  }
}

export const Wrapper = styled.div``;

export const Content = styled.div`
  width: 100%;
  padding: 0;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 8.5px 20px;
  border-top: 1px solid ${(props) => props.theme.colors.border.alt3};
  background: ${(props) => props.theme.colors.orderLine.header.background};
`;

export const HeaderValue = styled.div<{ widthPercentage: number }>`
  width: ${(props) => `${props.widthPercentage.toString()}`}%;
  p {
    font-size: ${(props) => props.theme.typography.size.small};
    font-weight: ${(props) => props.theme.typography.weight.medium};
    color: ${(props) => props.theme.colors.font.primary.alt6};
  }
`;

export const DetailWrapper = styled.div`
  > * {
    &:last-child {
      border-bottom-left-radius: ${STYLING.dimensions.borderRadius};
      border-bottom-right-radius: ${STYLING.dimensions.borderRadius};
    }
  }
`;

export const DetailGroup = styled.div``;

export const DetailLine = styled.div<{
  type: MintStatusType;
  ownerLine: boolean;
}>`
  display: flex;
  justify-content: space-between;
  padding: 6.5px 20px;
  background: ${(props) =>
    props.ownerLine
      ? props.theme.colors.orderLine.ownerLine.background
      : getDetailLineBackground(props.type, props.theme)};
  p {
    font-size: ${(props) => props.theme.typography.size.xSmall};
    font-weight: ${(props) => props.theme.typography.weight.medium};
    color: ${(props) => props.theme.colors.font.primary.base};
  }
`;

export const DetailSubheader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6.5px 20px;
  border-top: 1px solid ${(props) => props.theme.colors.border.alt3};
  border-bottom: 1px solid ${(props) => props.theme.colors.border.alt3};
  background: ${(props) => props.theme.colors.orderLine.subheader.background};
  p {
    font-size: ${(props) => props.theme.typography.size.xSmall};
    font-weight: ${(props) => props.theme.typography.weight.medium};
    color: ${(props) => props.theme.colors.font.primary.alt1};
  }
`;

export const DetailValue = styled.div<{ widthPercentage: number }>`
  width: ${(props) => `${props.widthPercentage.toString()}`}%;
  p {
    font-size: ${(props) => props.theme.typography.size.xSmall};
    font-weight: ${(props) => props.theme.typography.weight.medium};
    color: ${(props) => props.theme.colors.font.primary.base};
  }
`;

export const MintValue = styled.p`
  color: ${(props) => props.theme.colors.font.primary.positive} !important;
`;
