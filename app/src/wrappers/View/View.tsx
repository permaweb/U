import React from "react";

import * as S from "./styles";

export default function View(props: { children: React.ReactNode }) {
  return <S.Wrapper>{props.children}</S.Wrapper>;
}
