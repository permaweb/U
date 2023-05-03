import React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { IconButton } from 'components/atoms/IconButton';
import { ASSETS } from 'helpers/config';
import * as urls from 'helpers/urls';
import {
  checkDesktop,
  checkWindowResize,
  hideDocumentBody,
  showDocumentBody,
} from 'helpers/window';
import { WalletConnect } from 'wallet/WalletConnect';

import * as S from './styles';

export default function Header() {
  const [open, setOpen] = React.useState(checkDesktop());
  const [desktop, setDesktop] = React.useState(checkDesktop());

  function handleWindowResize() {
    if (checkDesktop()) {
      setDesktop(true);
      setOpen(true);
    } else {
      setDesktop(false);
      setOpen(false);
    }
  }

  function handleNavStatus() {
    checkDesktop() ? setOpen(true) : setOpen(!open);
  }

  checkWindowResize(handleWindowResize);

  if (open && !checkDesktop()) {
    hideDocumentBody();
  } else {
    showDocumentBody();
  }

  function getWalletDisplay() {
    return !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  function navList() {
    return (
      <S.NC>
        <S.SC>
          <S.Connect show={getWalletDisplay()}>
            <WalletConnect callback={() => setOpen(!open)} />
          </S.Connect>
        </S.SC>
      </S.NC>
    );
  }

  function getNav() {
    if (desktop) {
      return navList();
    } else {
      return (
        <>
          <S.NCMobile>
            <S.MenuContainer>
              <S.Menu>
                <IconButton
                  type={'primary'}
                  warning={open}
                  src={open ? ASSETS.close : ASSETS.menu}
                  handlePress={handleNavStatus}
                />
              </S.Menu>
            </S.MenuContainer>
          </S.NCMobile>
          {open && <S.OpenContainer>{navList()}</S.OpenContainer>}
        </>
      );
    }
  }

  return (
    <S.Wrapper>
      <S.NavContainer>
        <S.LogoContainer>
          <Link to={urls.base} onClick={() => setOpen(false)}>
            <S.LogoContent>
              <ReactSVG src={ASSETS.logo} />
            </S.LogoContent>
          </Link>
        </S.LogoContainer>
        {getNav()}
      </S.NavContainer>
    </S.Wrapper>
  );
}
