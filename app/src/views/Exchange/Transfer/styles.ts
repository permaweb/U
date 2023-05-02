import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TWrapper = styled.div``;

export const DWrapper = styled.div`
  p {
    margin: 10px 0 0 0;
    color: ${(props) => props.theme.colors.font.primary.alt7};
    font-weight: ${(props) => props.theme.typography.weight.medium};
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
  margin: 30px 0 10px 0;
  svg {
    width: 20px;
  }
`;

export const ConnectWrapper = styled.div``;
