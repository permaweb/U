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

const { transfer, getState, getUBalance } = env;

export default function Transfer() {
  const arProvider = useArweaveProvider();

  const [state, setState] = React.useState<State | undefined>();
  const [connectedUBalance, setConnectedUBalance] = React.useState<
    number | undefined
  >();
  const [connectedUBalanceError, setConnectedUBalanceError] = React.useState<
    string | undefined
  >();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [transferResult, setTransferResult] =
    React.useState<ResponseType | null>(null);

  const [UAmount, setUAmount] = React.useState<number>(0);
  const [recipient, setRecipient] = React.useState<string>('');

  useEffect(() => {
    getState('KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw')
      .then(setState)
      .catch((e: any) => console.log(e));
  }, []);

  useEffect(() => {
    if (arProvider.walletAddress && state && !connectedUBalanceError) {
      getUBalance('KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw', arProvider.walletAddress)
        .then(setConnectedUBalance)
        .catch((e: any) => setConnectedUBalanceError(e.message || 'Error'));
    }
  }, [state, arProvider.walletAddress]);

  function getAction() {
    let action: () => void;
    let disabled: boolean;
    let label: string;

    if (!arProvider.walletAddress) {
      disabled = false;
    } else {
      disabled = UAmount <= 0 || !recipient || loading;
    }

    if (!arProvider.walletAddress) {
      action = () => arProvider.setWalletModalVisible(true);
      label = language.connectWallet;
    } else {
      action = () => transferU();
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

  const transferU = async () => {
    setLoading(true);
    transfer({
      contractId: 'KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw',
      from: arProvider.walletAddress as string,
      qty: UAmount,
      target: recipient,
    })
      // Same shape as the contract State
      .then((output: any) => {
        setLoading(false);
        setTransferResult({
          status: true,
          message: language.transferSuccess,
        });
        if (connectedUBalance) {
          setConnectedUBalance(
            Math.floor(connectedUBalance) - Math.floor(UAmount),
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

          <S.FWrapper>
            <FormField
              type={'number'}
              label={language.amount}
              value={UAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUAmount(parseFloat(e.target.value))
              }
              disabled={!arProvider.walletAddress}
              invalid={{ status: false, message: null }}
              logo={ASSETS.uLogo}
            />
            <S.BWrapper>
              <p>
                <span>{`${language.uBalance}: `}</span>
                {`${connectedUBalance || '-'}`}
              </p>
            </S.BWrapper>
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
