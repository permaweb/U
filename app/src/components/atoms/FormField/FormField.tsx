import React from "react";
import { ReactSVG } from "react-svg";

import * as S from "./styles";
import { IProps } from "./types";

export default function FormField(props: IProps) {
  const [focused, setFocused] = React.useState<boolean>(false);

  function getValue() {
    if (props.type === "number") {
      return isNaN(Number(props.value)) ? "" : props.value;
    } else {
      return props.value;
    }
  }

  return (
    <S.Wrapper
      sm={props.sm}
      disabled={props.disabled}
      invalid={props.invalid.status}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      focused={focused}
    >
      {props.label && <S.Label>{props.label}</S.Label>}
      <S.Input
        type={props.type ? props.type : "text"}
        value={getValue()}
        onChange={props.onChange}
        disabled={props.disabled}
        placeholder={props.placeholder ? props.placeholder : ""}
        sm={props.sm}
        data-testid={props.testingCtx}
        spellCheck={false}
      />
      <S.LogoContainer>
        {props.logo && <ReactSVG src={props.logo} />}
      </S.LogoContainer>
    </S.Wrapper>
  );
}
