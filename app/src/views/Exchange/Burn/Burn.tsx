import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import { ReactSVG } from 'react-svg';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { Notification } from 'components/atoms/Notification';

import { ASSETS } from 'helpers/config';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import { language } from 'helpers/language';
import { ResponseType } from 'helpers/types';
import * as S from './styles';
import { MintRequest, StateL1, StateSEQ, env } from 'api';

const { getQueue, getState, createMint } = env;

export default function Burn() {
  const arProvider = useArweaveProvider();

  const [stateSEQ, setStateSEQ] = React.useState<StateSEQ>();
  const [stateL1, setStateL1] = React.useState<StateL1>();
  const [queue, setQueue] = React.useState<any>();
  const [created, setCreated] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [burnResult, setBurnResult] = React.useState<ResponseType | null>(null);

  const [arAmount, setArAmount] = React.useState<number>(0);
  const [reBarAmount, setRebarAmount] = React.useState<number>(0);

  function getAction() {
    let action: () => void;
    let disabled: boolean;
    let label: string;

    if (!arProvider.walletAddress) {
      disabled = false;
    } else {
      disabled =
        reBarAmount <= 0 ||
        reBarAmount > arProvider.availableBalance! ||
        loading;
    }

    if (!arProvider.walletAddress) {
      action = () => arProvider.setWalletModalVisible(true);

      label = language.connectWallet;
    } else {
      action = () => burnAR();
      label = language.burn;
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

  function burnAR() {
    setLoading(true);
    createMint({
      contractId: import.meta.env.VITE_CONTRACT_L1 || '',
      qty: arAmount,
    }).then((r: any) => {
      setLoading(false);
      setBurnResult({
        status: true,
        message: language.burnSuccess,
      });
    });
  }

  useEffect(() => {
    getState(import.meta.env.VITE_CONTRACT_SEQ).then((s: StateSEQ) => {
      setStateSEQ(s);
      getQueue(import.meta.env.VITE_CONTRACT_L1).then((requests: any[]) => {
        setQueue(requests);
      });
    });
    getState(import.meta.env.VITE_CONTRACT_L1).then((s: StateL1) => {
      setStateL1(s);
    });
  }, []);

  useEffect(() => {
    setRebarAmount(arAmount);
  }, [arAmount]);

  return (
    <>
      {burnResult && (
        <Notification
          type={burnResult.status === true ? 'success' : 'warning'}
          message={burnResult.message!}
          callback={() => setBurnResult(null)}
        />
      )}

      <S.Wrapper className={'tab-wrapper'}>
        <S.TWrapper>
          <S.DWrapper>
            <h2>{language.burn}</h2>
            <p>{parse(language.burnDescription)}</p>
          </S.DWrapper>
          <S.BWrapper>
            <p>
              <span>{`${language.arBalance}: `}</span>
              {`${
                arProvider.walletAddress && arProvider.availableBalance !== null
                  ? Number(arProvider.availableBalance.toFixed(4))
                  : `-`
              }`}
            </p>
          </S.BWrapper>
          <S.FWrapper>
            <FormField
              type={'number'}
              label={language.from}
              value={arAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setArAmount(parseFloat(e.target.value))
              }
              disabled={!arProvider.walletAddress}
              invalid={{ status: false, message: null }}
              logo={ASSETS.arweaveLogo}
            />

            <S.Divider>
              <ReactSVG src={ASSETS.arrowDown} />
            </S.Divider>

            <FormField
              type={'number'}
              label={language.to}
              value={reBarAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRebarAmount(parseFloat(e.target.value))
              }
              disabled={true}
              invalid={{ status: false, message: null }}
              logo={ASSETS.rebarLogo}
            />
          </S.FWrapper>
        </S.TWrapper>
        <S.AWrapper>{getAction()}</S.AWrapper>
        {created && (
          <p>Mint created! It should be confirmed in like 20 minutes.</p>
        )}
      </S.Wrapper>

      <S.DetailWrapper>
        {queue && (
          <>
            <S.DHeader>
              <p>
                {language.requestQueue} ({queue?.length || 0})
              </p>
            </S.DHeader>
            {queue.map((request: MintRequest, index: number) => {
              const widthPercentage = 100 / 4;
              return (
                <React.Fragment key={index}>
                  <S.DetailSubheader>
                    <p>{`${language.requestTransaction}: ${formatAddress(request.tx, true)}`}</p>
                  </S.DetailSubheader>
                  <S.DetailLine
                    key={index}
                    type={'pending'}
                    ownerLine={
                      arProvider.walletAddress
                        ? arProvider.walletAddress === request.target
                        : false
                    }
                  >
                    <S.DetailValue widthPercentage={widthPercentage}>
                      <p>{`${formatAddress(request.target, true)}`}</p>
                    </S.DetailValue>
                    <S.DetailValue widthPercentage={widthPercentage}>
                      <S.Qty>{`${language.qty}: ${request.qty}`}</S.Qty>
                    </S.DetailValue>
                    <S.DetailValue widthPercentage={widthPercentage}>
                      <p>{`${language.expires}: ${request.expires}`}</p>
                    </S.DetailValue>
                  </S.DetailLine>
                </React.Fragment>
              );
            })}
          </>
        )}
      </S.DetailWrapper>
    </>
  );
}
