import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import { ReactSVG } from 'react-svg';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { FormField } from 'components/atoms/FormField';
import { Notification } from 'components/atoms/Notification';
import { Modal } from 'components/molecules/Modal';

import { ASSETS, U_CONTRACT_ID } from 'helpers/config';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import { language } from 'helpers/language';
import { ResponseType } from 'helpers/types';
import * as S from './styles';
import { env, State } from 'api';

const { burn, getPollingTx, pollMint, getState, getUBalance } = env;

export default function Burn() {
  const arProvider = useArweaveProvider();

  const [state, setState] = React.useState<State | undefined>();

  const [polling, setPolling] = React.useState<boolean>(false);
  const [pollingTx, setPollingTx] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [burnResult, setBurnResult] = React.useState<ResponseType | null>(null);
  const [mintResult, setMintResult] = React.useState<ResponseType | null>(null);
  const [finalizeInfo, setShowFinalizeInfo] = React.useState<boolean>(false);
  const [connectedUBalance, setConnectedUBalance] = React.useState<
    number | undefined
  >();
  const [connectedUBalanceError, setConnectedUBalanceError] = React.useState<
    string | undefined
  >();

  const [arAmount, setArAmount] = React.useState<number>(0);
  const [UAmount, setUAmount] = React.useState<number>(0);

  useEffect(() => {
    getState(U_CONTRACT_ID)
      .then(setState)
      .catch((e: any) => console.log(e));
  }, []);

  useEffect(() => {
    if (arProvider.walletAddress && state && !connectedUBalanceError) {
      getUBalance(U_CONTRACT_ID, arProvider.walletAddress)
        .then(setConnectedUBalance)
        .catch((e: any) => setConnectedUBalanceError(e.message || 'Error'));
    }
  }, [state, arProvider.walletAddress]);

  useEffect(() => {
    setUAmount(arAmount);
  }, [arAmount]);

  useEffect(() => {
    setPollingTx(getPollingTx());
  }, []);

  useEffect(() => {
    if (pollingTx) {
      if (pollingTx.error) {
        setBurnResult({ status: false, message: pollingTx.error });
      }
      else {
        setPolling(true);
        pollMint(pollingTx)
          .toPromise()
          .then((r: any) => {
            setPolling(false);
            console.log(r);
          });
      }
    }
  }, [pollingTx]);

  function getAction() {
    let action: () => void;
    let disabled: boolean;
    let label: string;

    if (!arProvider.walletAddress) {
      disabled = false;
    } else {
      disabled =
        UAmount <= 0 ||
        UAmount > arProvider.availableBalance! ||
        loading ||
        polling;
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
    if (U_CONTRACT_ID) {
      setLoading(true);
      burn({
        contractId: U_CONTRACT_ID,
        qty: arAmount,
      }).then((tx: string) => {
        setPollingTx(tx);
        setLoading(false);
        setBurnResult({
          status: true,
          message: language.burnSuccess,
        });
      }).catch((e: any) => console.error(e));
    }
  }

  return (
    <>
      {burnResult && (
        <Notification
          type={burnResult.status === true ? 'success' : 'warning'}
          message={burnResult.message!}
          callback={() => setBurnResult(null)}
        />
      )}

      {mintResult && (
        <Notification
          type={mintResult.status === true ? 'success' : 'warning'}
          message={mintResult.message!}
          callback={() => setMintResult(null)}
        />
      )}

      {finalizeInfo && (
        <Modal
          header={language.finalizeBurn}
          handleClose={() => setShowFinalizeInfo(false)}
        >
          <S.InfoWrapper>
            <p>{language.mintDescription}</p>
          </S.InfoWrapper>
        </Modal>
      )}

      <S.Wrapper className={'tab-wrapper'}>
        <S.TWrapper>
          <S.DWrapper>
            <h2>{language.burn}</h2>
            <p>{parse(language.burnDescription)}</p>
          </S.DWrapper>
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
            <S.BWrapper>
              <p>
                <span>{`${language.arBalance}: `}</span>
                {`${
                  arProvider.walletAddress &&
                  arProvider.availableBalance !== null
                    ? Number(arProvider.availableBalance.toFixed(4))
                    : `-`
                }`}
              </p>
            </S.BWrapper>

            <S.Divider>
              <ReactSVG src={ASSETS.arrowDown} />
            </S.Divider>

            <FormField
              type={'number'}
              label={language.to}
              value={UAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUAmount(parseFloat(e.target.value))
              }
              disabled={true}
              invalid={{ status: false, message: null }}
              logo={ASSETS.uLogo}
            />
            <S.BWrapper>
              <p>
                <span>{`${language.uBalance}: `}</span>
                {`${connectedUBalance || '-'}`}
              </p>
            </S.BWrapper>
          </S.FWrapper>
        </S.TWrapper>
        <S.AWrapper>{getAction()}</S.AWrapper>
      </S.Wrapper>

      {polling && (
        <S.InfoWrapper className={'border-wrapper'}>
          <p>{`${language.pollingTx}: ${formatAddress(pollingTx, true)}`}</p>
          <S.PollingLoader>
            <Loader sm />
          </S.PollingLoader>
        </S.InfoWrapper>
      )}
    </>
  );
}
