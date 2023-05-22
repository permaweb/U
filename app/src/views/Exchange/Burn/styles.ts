import styled, { DefaultTheme } from 'styled-components';

import { open, fadeIn2 } from 'helpers/animations';
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

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: ${open} ${fadeIn2};
`;

export const TWrapper = styled.div``;

export const DWrapper = styled.div`
  p {
    margin: 10px 0 0 0;
    color: ${(props) => props.theme.colors.font.primary.alt7};
    font-weight: ${(props) => props.theme.typography.weight.medium};

    span {
      color: ${(props) => props.theme.colors.font.primary.alt8};
    }
  }
`;

export const BWrapper = styled.div`
    p, span {
        font-weight: ${(props) => props.theme.typography.weight.bold};
        font-family: ${(props) => props.theme.typography.family.alt1};
        font-size: 24px;
    }
    p {
        margin: 20px 0 0 0;
        color: ${(props) => props.theme.colors.font.primary.alt8};
    }
`;

export const FWrapper = styled.div`
  margin: 30px 0 0 0;
`;

export const Divider = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0 20px 0;
  svg {
    width: 40px;
  }
`;

export const AWrapper = styled.div`
  margin: 20px 0 0 0;
`;

export const DetailWrapper = styled.div`
  margin: 40px 0 0 0;
  > * {
    &:last-child {
      border-bottom-left-radius: ${STYLING.dimensions.borderRadius};
      border-bottom-right-radius: ${STYLING.dimensions.borderRadius};
    }
  }
`;

export const DHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15.5px 20px;
  border-top: 1px solid ${(props) => props.theme.colors.border.alt3};
  border-left: 1px solid ${(props) => props.theme.colors.border.alt3};
  border-right: 1px solid ${(props) => props.theme.colors.border.alt3};
  background: ${(props) => props.theme.colors.orderLine.header.background};
  border-top-left-radius: ${STYLING.dimensions.borderRadius};
  border-top-right-radius: ${STYLING.dimensions.borderRadius};
  p {
    font-size: ${(props) => props.theme.typography.size.small};
    font-weight: ${(props) => props.theme.typography.weight.medium};
    color: ${(props) => props.theme.colors.font.primary.alt1};
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

export const Qty = styled.p`
  color: ${(props) => props.theme.colors.font.primary.positive} !important;
`;
