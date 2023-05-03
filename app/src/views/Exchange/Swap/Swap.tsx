import React from "react";
import parse from "html-react-parser";
import { ReactSVG } from "react-svg";

import { Button } from "components/atoms/Button";
import { FormField } from "components/atoms/FormField";
import { Notification } from "components/atoms/Notification";

import { ASSETS } from "helpers/config";
import { useArweaveProvider } from "providers/ArweaveProvider";

import { language } from "helpers/language";
import { ResponseType } from "helpers/types";
import * as S from "./styles";
import { getState } from "api";

// TODO: get reBAR balance
// TODO: invalid arAmount
export default function Swap() {
  const arProvider = useArweaveProvider();

  const [state, setState] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [swapResult, setSwapResult] = React.useState<ResponseType | null>(null);

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
      action = () => swapAR();
      label = language.swap;
    }

    return (
      <Button
        type={"alt1"}
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
    setTimeout(() => {
      setLoading(false);
      setSwapResult({
        status: true,
        message: language.swapSuccess,
      });
    }, 1000);
  }

  React.useEffect(() => {
    getState(import.meta.env.VITE_CONTRACT_SEQ).then(setState);
  }, []);

  React.useEffect(() => {
    setRebarAmount(arAmount);
  }, [arAmount]);

  return (
    <>
      {swapResult && (
        <Notification
          type={swapResult.status === true ? "success" : "warning"}
          message={swapResult.message!}
          callback={() => setSwapResult(null)}
        />
      )}

      <S.Wrapper className={"tab-wrapper"}>
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
              type={"number"}
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
              type={"number"}
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
