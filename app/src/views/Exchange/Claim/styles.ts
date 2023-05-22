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
    span {
7};
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

export const ConnectWrapper = styled.div``;
