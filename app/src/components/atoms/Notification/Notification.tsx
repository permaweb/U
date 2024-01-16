import React from 'react';

import { ASSETS, DOM } from 'helpers/config';

import { IconButton } from '../IconButton';
import { Portal } from '../Portal';

import * as S from './styles';
import { IProps } from './types';

export default function Notification(props: IProps) {
  const [show, setShow] = React.useState<boolean>(true);

  function handleClose() {
    setShow(false);
    props.callback();
  }

  return show ? (
    <Portal node={DOM.notification}>
      <S.Wrapper>
        <S.Message>{props.message}</S.Message>
        {/* <S.Icon type={props.type}>
          <ReactSVG
            src={props.type === 'warning' ? ASSETS.close : ASSETS.checkmark}
          />
        </S.Icon> */}
        <S.Close>
          <IconButton
            type={'primary'}
            sm
            src={ASSETS.close}
            handlePress={handleClose}
          />
        </S.Close>
      </S.Wrapper>
    </Portal>
  ) : null;
}
