import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import { ReactSVG } from 'react-svg';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { Notification } from 'components/atoms/Notification';
import { Modal } from 'components/molecules/Modal';

import { ASSETS } from 'helpers/config';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import { language } from 'helpers/language';
import { ResponseType } from 'helpers/types';
import * as S from './styles';
import { env } from 'api';

const { burn, getPollingTx, pollMint, getRebarBalance } = env;

export default function Burn() {
  const arProvider = useArweaveProvider();

  const [pollingTx, setPollingTx] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [burnResult, setBurnResult] = React.useState<ResponseType | null>(null);
  const [mintResult, setMintResult] = React.useState<ResponseType | null>(null);
  const [finalizeInfo, setShowFinalizeInfo] = React.useState<boolean>(false);

  const [arAmount, setArAmount] = React.useState<number>(0);
  const [reBarAmount, setRebarAmount] = React.useState<number>(0);

  // useEffect(() => {
  //   setRebarAmount(arAmount);
  // }, [arAmount]);

  useEffect(() => {
    setPollingTx(getPollingTx());
  }, []);

  useEffect(() => {
    if (pollingTx) {
      pollMint(pollingTx)
        .toPromise()
        .then((r: any) => {
          console.log(r);
        });
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
    burn({
      contractId: import.meta.env.VITE_CONTRACT || '',
      qty: arAmount,
    }).then((r: any) => {
      setLoading(false);
      setBurnResult({
        status: true,
        message: language.burnSuccess,
      });
    });
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
      </S.Wrapper>
    </>
  );
}
