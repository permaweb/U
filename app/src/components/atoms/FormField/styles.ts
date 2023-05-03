import styled, { DefaultTheme } from 'styled-components';

import { STYLING } from 'helpers/styling';

function getBorder(theme: DefaultTheme, invalid: boolean, focused: boolean) {
  if (invalid) {
    return theme.colors.form.invalid.outline;
  }
  if (focused) {
    return theme.colors.form.valid.outline;
  } else {
    return theme.colors.form.border;
  }
}

function getBackground(theme: DefaultTheme, disabled: boolean) {
  if (disabled) {
    return theme.colors.form.disabled.background;
  } else {
    return theme.colors.form.background;
  }
}

export const Wrapper = styled.div<{
  sm: boolean | undefined;
  disabled: boolean;
  invalid: boolean;
  focused: boolean;
}>`
  width: 100%;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${(props) => getBackground(props.theme, props.disabled)};
  border: 1px solid
    ${(props) => getBorder(props.theme, props.invalid, props.focused)};
  border-radius: ${STYLING.dimensions.borderRadiusWrapper};
  @media (max-width: ${STYLING.cutoffs.initial}) {
    max-width: none;
  }
`;

export const Label = styled.label`
  font-size: ${(props) => props.theme.typography.size.xSmall};
  font-weight: ${(props) => props.theme.typography.weight.medium};
  color: ${(props) => props.theme.colors.font.primary.alt1};
  margin: 16.5px 0 0 16.5px;
`;

export const Input = styled.input<{
  sm: boolean | undefined;
  disabled: boolean;
  step?: any;
}>`
  height: ${(props) =>
    props.sm
      ? STYLING.dimensions.formHeightSm
      : STYLING.dimensions.formHeightMax};
  color: ${(props) =>
    props.disabled
      ? props.theme.colors.form.disabled.label
      : props.theme.colors.font.primary.alt1};
  font-size: ${(props) =>
    props.sm ? props.theme.typography.size.small : '24px'};
  font-weight: ${(props) => props.theme.typography.weight.medium};
  font-family: ${(props) => props.theme.typography.family.alt1};
  margin: 0;
  border-bottom-left-radius: ${STYLING.dimensions.borderRadiusWrapper};
  border-bottom-right-radius: ${STYLING.dimensions.borderRadiusWrapper};
  border: none;
  background: ${(props) => props.theme.colors.transparent};
  padding: 10px 52.5px 10px 15px;
`;

export const LogoContainer = styled.div`
  position: absolute;
  right: 20px;
  bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 35px;
    fill: ${(props) => props.theme.colors.icon.alt2.fill};
  }
`;
