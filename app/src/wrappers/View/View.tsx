import React from 'react';

import { FAQ } from 'components/atoms/FAQ';

import * as S from './styles';

export default function View(props: { children: React.ReactNode }) {
  return (
    <S.Wrapper>
      <S.FAQWrapper>
        <FAQ />
      </S.FAQWrapper>
      {props.children}
    </S.Wrapper>
  );
}
