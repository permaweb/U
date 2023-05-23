import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import { Button } from 'components/atoms/Button';
import { Notification } from 'components/atoms/Notification';
import { formatAddress } from 'helpers/utils';
import { language } from 'helpers/language';
import * as S from './styles';
import { Claimable, env, StateSEQ } from 'api';
import { ResponseType } from 'helpers/types';

const { getState, getRebarBalance, claim } = env;

export default function Claim() {
  const arProvider = useArweaveProvider();

  const [state, setState] = React.useState<StateSEQ | undefined>();
  const [connectedRebarBalance, setConnectedRebarBalance] = React.useState<
    number | undefined
  >();
  const [connectedRebarBalanceError, setConnectedRebarBalanceError] =
    React.useState<string | undefined>();
  const [connectedClaims, setConnectedClaims] = React.useState<
    Claimable[] | undefined
  >();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [activeClaims, setActiveClaims] = React.useState<Claimable[]>([]);
  const [claimNotification, setClaimNotification] =
    React.useState<ResponseType | null>(null);

  useEffect(() => {
    if (arProvider.walletAddress) {
      getState(import.meta.env.VITE_CONTRACT_SEQ)
        .then((s: any) => {
          setState(s);
          const claims = s.claimable?.filter(
            (c: Claimable) => c.to === arProvider.walletAddress
          );
          if (claims?.length > 0) setConnectedClaims(claims);
        })
        .catch((e: any) => console.log(e));
    }
  }, [claim]);

  useEffect(() => {
    if (arProvider.walletAddress && state && !connectedRebarBalanceError) {
      getRebarBalance(
        import.meta.env.VITE_CONTRACT_SEQ,
        arProvider.walletAddress
      )
        .then(setConnectedRebarBalance)
        .catch((e: any) => setConnectedRebarBalanceError(e.message || 'Error'));
    }
  }, [state, connectedClaims]);

  function getAction() {
    let action: () => void;
    let disabled: boolean;
    let label: string;

    if (!arProvider.walletAddress) {
      disabled = false;
    } else {
      disabled = activeClaims.length <= 0;
    }

    if (!arProvider.walletAddress) {
      action = () => arProvider.setWalletModalVisible(true);
      label = language.connectWallet;
    } else {
      action = () => claimReBar();
      label = language.claim;
    }

    return (
      <Button
        type={'alt1'}
        label={label}
        handlePress={action}
        height={52.5}
        disabled={disabled}
        loading={loading}
        fullWidth
      />
    );
  }

  function handleActiveClaims(claim: Claimable) {
    const index = activeClaims.findIndex((c) => c.txID === claim.txID);

    if (index === -1) {
      setActiveClaims([...activeClaims, claim]);
    } else {
      const updatedClaims = [...activeClaims];
      updatedClaims.splice(index, 1);
      setActiveClaims(updatedClaims);
    }
  }

  const claimReBar = async () => {
    if (connectedClaims && activeClaims.length > 0) {
      for (let i = 0; i < activeClaims.length; i++) {
        await processClaim(activeClaims[i]);
      }
    }
  };

  const processClaim = async (c: Claimable) => {
    await claim({
      qty: c.qty,
      contractId: import.meta.env.VITE_CONTRACT_SEQ,
      tx: c.txID,
    })
      .then(() => {
        setConnectedClaims((prevClaims) =>
          prevClaims!.filter((claim) => claim.txID !== c.txID)
        );
        setClaimNotification({
          status: true,
          message: language.rebarClaimed,
        });
      })
      .catch((e: any) => {
        console.log(e);
        setClaimNotification({
          status: false,
          message: language.rebarClaimError,
        });
      });
  };

  function getClaims() {
    if (connectedClaims && connectedClaims.length > 0) {
      return (
        <>
          {connectedClaims.map((claim: Claimable) => {
            const active: boolean =
              activeClaims.findIndex((c) => c.txID === claim.txID) !== -1;

            return (
              <S.CDetailLine
                key={claim.txID}
                onClick={() => handleActiveClaims(claim)}
                active={active}
              >
                <S.CDetailLineInfo active={active}>
                  <S.CFlex>
                    <S.CDetailLineHeader>{`${language.qty}:`}</S.CDetailLineHeader>
                    &nbsp;
                    <S.CDetailLineHeaderValue>{`${(claim.qty / 1e6).toFixed(
                      2
                    )} ${language.rebar}`}</S.CDetailLineHeaderValue>
                  </S.CFlex>
                  <S.CFrom>
                    <span>{`${language.from}:`}</span>
                    &nbsp;
                    <p>{formatAddress(claim.from, true)}</p>
                  </S.CFrom>
                </S.CDetailLineInfo>
              </S.CDetailLine>
            );
          })}
        </>
      );
    } else {
      return (
        <S.Message>
          <p>
            {arProvider.walletAddress
              ? language.claimsEmpty
              : language.connectWallet}
          </p>
        </S.Message>
      );
    }
  }

  return (
    <>
      {claimNotification && (
        <Notification
          type={claimNotification.status === true ? 'success' : 'warning'}
          message={claimNotification.message!}
          callback={() => setClaimNotification(null)}
        />
      )}
      <S.Wrapper className={'tab-wrapper'}>
        <S.TWrapper>
          <S.DWrapper>
            <h2>{language.claim}</h2>
            <p>{parse(language.claimDescription)}</p>
          </S.DWrapper>
          <S.BWrapper>
            <p>
              <span>{`${language.rebarBalance}: `}</span>
              {`${connectedRebarBalance || '-'}`}
            </p>
          </S.BWrapper>
          <S.CWrapper>{getClaims()}</S.CWrapper>
          <S.AWrapper>{getAction()}</S.AWrapper>
        </S.TWrapper>
      </S.Wrapper>
    </>
  );
}
