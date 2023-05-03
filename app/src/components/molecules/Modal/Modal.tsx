import React from 'react';

import { IconButton } from 'components/atoms/IconButton';
import { Portal } from 'components/atoms/Portal';
import { ASSETS, DOM } from 'helpers/config';
import { language } from 'helpers/language';
import * as windowUtils from 'helpers/window';

import * as S from './styles';
import { IProps } from './types';

export default function Modal(props: IProps) {
  React.useEffect(() => {
    windowUtils.hideDocumentBody();
    return () => {
      windowUtils.showDocumentBody();
    };
  }, []);

  const escFunction = React.useCallback(
    (e: any) => {
      if (e.key === 'Escape') {
        props.handleClose();
      }
    },
    [props]
  );

  React.useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  function getBody() {
    if (props.noContainer) {
      return (
        <>
          <S.BodyAlt>{props.children}</S.BodyAlt>
          <S.CloseTextContainerAlt>
            <S.CloseButtonContainer onClick={() => props.handleClose()}>
              {language.close}
            </S.CloseButtonContainer>
          </S.CloseTextContainerAlt>
        </>
      );
    } else {
      return (
        <>
          <S.Container noHeader={!props.header} useMax={props.useMax}>
            {props.header && (
              <S.Header>
                <S.LT>
                  <S.Title>{props.header}</S.Title>
                </S.LT>
                <S.Close>
                  <IconButton
                    type={'primary'}
                    sm
                    warning
                    src={ASSETS.close}
                    handlePress={() => props.handleClose()}
                  />
                </S.Close>
              </S.Header>
            )}
            <S.Body>{props.children}</S.Body>
          </S.Container>
          {!props.header && (
            <S.CloseTextContainer useMax={props.useMax}>
              <S.CloseButtonContainer onClick={() => props.handleClose()}>
                {language.close}
              </S.CloseButtonContainer>
            </S.CloseTextContainer>
          )}
        </>
      );
    }
  }

  return (
    <Portal node={DOM.modal}>
      <S.Wrapper top={window ? (window as any).pageYOffset : 0}>
        {getBody()}
      </S.Wrapper>
    </Portal>
  );
}
