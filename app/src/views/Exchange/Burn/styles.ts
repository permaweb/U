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
    line-height: 1.5;
    margin: 10px 0 0 0;
    color: ${(props) => props.theme.colors.font.primary.alt7};
    font-weight: ${(props) => props.theme.typography.weight.medium};

    span {
      color: ${(props) => props.theme.colors.font.primary.alt8};
    }
  }
`;

export const BWrapper = styled.div`
  p,
  span {
    line-height: 1.5;
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

export const InfoWrapper = styled.div`
  height: 50px;
  margin: 20px 0 0 0;
  background: ${(props) =>
    props.theme.colors.container.alt3.background} !important;
  border-radius: ${STYLING.dimensions.borderRadiusWrapper} !important;
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  p {
    line-height: 1.5;
    font-size: ${(props) => props.theme.typography.size.base};
    font-weight: ${(props) => props.theme.typography.weight.medium};
    color: ${(props) => props.theme.colors.font.primary.alt1};
  }
`;

export const PollingLoader = styled.div`
  position: relative;
`;
