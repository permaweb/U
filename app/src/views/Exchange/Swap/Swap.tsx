import React from 'react';
import parse from 'html-react-parser';
import { ReactSVG } from 'react-svg';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { Notification } from 'components/atoms/Notification';

import { ASSETS } from 'helpers/config';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import { language } from 'helpers/language';
import { ResponseType } from 'helpers/types';
import * as S from './styles';
import { StateL1, StateSEQ, env } from 'api';

const { getQueue, getState, createMint } = env;
// TODO: get reBAR balance
// TODO: invalid arAmount
export default function Swap() {
  const arProvider = useArweaveProvider();

  const [stateSEQ, setStateSEQ] = React.useState<StateSEQ>();
  const [stateL1, setStateL1] = React.useState<StateL1>();
  const [queue, setQueue] = React.useState<any>();
  const [created, setCreated] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [swapResult, setSwapResult] = React.useState<ResponseType | null>(null);

  const [arAmount, setArAmount] = React.useState<number>(0);
  const [reBarAmount, setRebarAmount] = React.useState<number>(0);

  const connectedRebarBalance =
    stateSEQ?.balances[arProvider?.walletAddress || ''] || 0;

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
      action = () => swapAR();
      label = language.swap;
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

  function swapAR() {
    console.log(`Swap ${arAmount} AR for ${reBarAmount} reBAR`);
    setLoading(true);
    createMint({
      contractId: import.meta.env.VITE_CONTRACT_L1 || '',
      qty: arAmount,
    }).then((r: any) => {
      console.log('Create mint response', r);
      setLoading(false);
      setSwapResult({
        status: true,
        message: language.swapSuccess,
      });
    });
  }

  React.useEffect(() => {
    getState(import.meta.env.VITE_CONTRACT_SEQ).then((s: StateSEQ) => {
      console.log('StateSEQ', s);
      setStateSEQ(s);
      getQueue(import.meta.env.VITE_CONTRACT_L1, s.pile).then(
        (requests: any[]) => {
          console.log('Requests', JSON.stringify(requests));
          setQueue(requests);
        }
      );
    });
    getState(import.meta.env.VITE_CONTRACT_L1).then((s: StateL1) => {
      console.log('StateL1', s);
      setStateL1(s);
    });
  }, []);

  React.useEffect(() => {
    setRebarAmount(arAmount);
  }, [arAmount]);

  return (
    <>
      {swapResult && (
        <Notification
          type={swapResult.status === true ? 'success' : 'warning'}
          message={swapResult.message!}
          callback={() => setSwapResult(null)}
        />
      )}

      <S.Wrapper className={'tab-wrapper'}>
        <S.TWrapper>
          <S.DWrapper>
            <h2>{language.swap}</h2>
            <p>{parse(language.swapDescription)}</p>
          </S.DWrapper>
          <S.BWrapper>
            <p>
              <span>{`${language.arBalance}: `}</span>
              {`${
                arProvider.walletAddress && arProvider.availableBalance
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
              logo={ASSETS.RebARLogo}
            />
          </S.FWrapper>
        </S.TWrapper>
        <S.AWrapper>{getAction()}</S.AWrapper>
        {created && (
          <p>Mint created! It should be confirmed in like 20 minutes.</p>
        )}
      </S.Wrapper>
    </>
  );
}
