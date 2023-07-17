import styled from 'styled-components';

import { open, fadeIn2 } from 'helpers/animations';

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
  display: flex;
  justify-content: right;
  align-items: center;
  background: ${(props) => props.theme.colors.container.alt8.background};
  border-radius: 0px 0px 12px 12px;
  padding: 24px 12px 12px 12px;
  z-index: -1;
  transform: translateY(-12px);

  p,
  span {
    line-height: 1.5;
    font-weight: ${(props) => props.theme.typography.weight.bold};
    font-family: ${(props) => props.theme.typography.family.alt1};
    font-size: 12px;
  }
  p {
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
  margin: 12.5px 0 20px 0;
  svg {
    width: 40px;
  }
`;

export const AWrapper = styled.div`
  margin: 20px 0 0 0;
`;
