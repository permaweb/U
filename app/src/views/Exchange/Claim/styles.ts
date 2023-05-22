import styled from 'styled-components';

import { open, fadeIn2 } from 'helpers/animations';
import { STYLING } from 'helpers/styling';

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

export const CWrapper = styled.div`
    height: 273.5px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      width: 0px;
    }
    margin: 20px 0 0 0;
`;

export const CDetailLine = styled.button<{ active: boolean }>`
  background: ${(props) =>
    props.active
      ? props.theme.colors.button.primary.active.background
      : props.theme.colors.button.primary.background};
  border-radius: ${STYLING.dimensions.borderRadiusWrapper};
  border: 1px solid ${(props) => props.theme.colors.border.primary};
  padding: 15px;
  margin: 0 0 20px 0;
  &:hover {
    background: ${(props) =>
      props.active
        ? props.theme.colors.button.primary.active.hover
        : props.theme.colors.button.primary.hover};
  }
  &:focus {
    background: ${(props) =>
      props.active
        ? props.theme.colors.button.primary.active.hover
        : props.theme.colors.button.primary.hover};
  }
`;

export const CDetailLineInfo = styled.div<{ active: boolean }>`
  height: 100%;
  width: 100%;
  p, span {
    font-size: ${(props) => props.theme.typography.size.small};
    font-weight: ${(props) => props.theme.typography.weight.bold};
  }
  span {
    color: ${(props) =>
      props.active
        ? props.theme.colors.button.primary.active.label
        : props.theme.colors.font.primary.alt7};
  }
  p {
    color: ${(props) =>
      props.active
        ? props.theme.colors.button.primary.active.label
        : props.theme.colors.font.primary.alt8};
  }
`;

export const CDetailLineHeader = styled.span`
  font-family: ${(props) => props.theme.typography.family.alt1} !important;
  font-size: ${(props) => props.theme.typography.size.lg} !important;
`;

export const CDetailLineHeaderValue = styled.p`
  font-family: ${(props) => props.theme.typography.family.alt1} !important;
  font-size: ${(props) => props.theme.typography.size.lg} !important;
`;

export const CFlex = styled.div`
  display: flex;
  align-items: center;
`;

export const CFrom = styled(CFlex)`
  margin: 10px 0 0 0;
`;

export const AWrapper = styled.div`
  margin: 20px 0 0 0;
`;