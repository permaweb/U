import React from 'react';
import { ReactSVG } from 'react-svg';

import { ASSETS } from 'helpers/config';

import * as S from './styles';
import { IProps } from './types';

export default function Drawer(props: IProps) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <S.Wrapper>
      <S.Action onClick={() => setOpen(!open)} open={open}>
        <S.Label>
          <span>{props.title}</span>
          <ReactSVG src={open ? ASSETS.arrowUp : ASSETS.arrowDown} />
        </S.Label>
      </S.Action>
      {open && <S.Content>{props.content}</S.Content>}
    </S.Wrapper>
  );
}
