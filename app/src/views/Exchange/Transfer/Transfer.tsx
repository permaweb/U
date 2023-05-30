import React, { useEffect } from 'react';
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
import { env } from 'api';
import { State } from 'api';

const { transfer, getState, getRebarBalance } = env;

export default function Transfer() {
  const arProvider = useArweaveProvider();

  const [state, setState] = React.useState<State | undefined>();
  const [connectedRebarBalance, setConnectedRebarBalance] = React.useState<
    number | undefined
  >();
  const [connectedRebarBalanceError, setConnectedRebarBalanceError] =
    React.useState<string | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [transferResult, setTransferResult] =
    React.useState<ResponseType | null>(null);

  const [reBarAmount, setRebarAmount] = React.useState<number>(0);
  const [recipient, setRecipient] = React.useState<string>('');

  useEffect(() => {
    getState(import.meta.env.VITE_CONTRACT)
      .then(setState)
      .catch((e: any) => console.log(e));
  }, []);

  useEffect(() => {
    if (arProvider.walletAddress && state && !connectedRebarBalanceError) {
      getRebarBalance(import.meta.env.VITE_CONTRACT, arProvider.walletAddress)
        .then(setConnectedRebarBalance)
        .catch((e: any) => setConnectedRebarBalanceError(e.message || 'Error'));
    }
  }, [state, arProvider.walletAddress]);

  function getAction() {
    let action: () => void;
    let disabled: boolean;
    let label: string;

    if (!arProvider.walletAddress) {
      disabled = false;
    } else {
      disabled = reBarAmount <= 0 || !recipient || loading;
    }

    if (!arProvider.walletAddress) {
      action = () => arProvider.setWalletModalVisible(true);
      label = language.connectWallet;
    } else {
      action = () => transferReBar();
      label = language.transfer;
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

  const transferReBar = async () => {
    setLoading(true);
    transfer({
      contractId: import.meta.env.VITE_CONTRACT,
      from: arProvider.walletAddress as string,
      qty: reBarAmount,
      target: recipient,
    })
      // Same shape as the contract State
      .then((output: any) => {
        setLoading(false);
        setTransferResult({
          status: true,
          message: language.transferSuccess,
        });
        if (connectedRebarBalance) {
          setConnectedRebarBalance(
            Math.floor(connectedRebarBalance) - Math.floor(reBarAmount)
          );
        }
      })
      .catch((e: any) => {
        console.log(e);
        setLoading(false);
        setTransferResult({
          status: false,
          message: language.transferFailure,
        });
      });
  };

  return (
    <>
      {transferResult && (
        <Notification
          type={transferResult.status === true ? 'success' : 'warning'}
          message={transferResult.message!}
          callback={() => setTransferResult(null)}
        />
      )}
      <S.Wrapper className={'tab-wrapper'}>
        <S.TWrapper>
          <S.DWrapper>
            <h2>{language.transfer}</h2>
            <p>{parse(language.transferDescription)}</p>
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
          <S.BWrapper>
            <p>
              <span>{`${language.rebarBalance}: `}</span>
              {`${connectedRebarBalance || '-'}`}
            </p>
          </S.BWrapper>
          <S.FWrapper>
            <FormField
              type={'number'}
              label={language.amount}
              value={reBarAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRebarAmount(parseFloat(e.target.value))
              }
              disabled={!arProvider.walletAddress}
              invalid={{ status: false, message: null }}
              logo={ASSETS.rebarLogo}
            />

            <S.Divider>
              <ReactSVG src={ASSETS.arrowDown} />
            </S.Divider>

            <FormField
              label={language.to}
              value={recipient}
              placeholder={language.transferRecipientPlaceholder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRecipient(e.target.value)
              }
              disabled={false}
              invalid={{ status: false, message: null }}
            />
          </S.FWrapper>
        </S.TWrapper>
        <S.AWrapper>{getAction()}</S.AWrapper>
      </S.Wrapper>
    </>
  );
}
