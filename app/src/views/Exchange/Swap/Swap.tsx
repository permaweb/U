import React from "react";
import parse from "html-react-parser";
import { ReactSVG } from "react-svg";

import { Button } from "components/atoms/Button";
import { FormField } from "components/atoms/FormField";
import { Notification } from "components/atoms/Notification";

import { ASSETS } from "helpers/config";
import { formatAddress } from "helpers/utils";
import { useArweaveProvider } from "providers/ArweaveProvider";

import { language } from "helpers/language";
import { ResponseType } from "helpers/types";
import * as S from "./styles";
import { StateL1, StateSEQ, env } from "api";

const { getQueue, getState, createMint } = env;

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
    stateSEQ?.balances[arProvider?.walletAddress || ""] || 0;

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
    setLoading(true);
    createMint({
      contractId: import.meta.env.VITE_CONTRACT_L1 || "",
      qty: arAmount,
    }).then((r: any) => {
      console.log("Create mint response", r);
      setLoading(false);
      setSwapResult({
        status: true,
        message: language.swapSuccess,
      });
    });
  }

  React.useEffect(() => {
    getState(import.meta.env.VITE_CONTRACT_SEQ).then((s: StateSEQ) => {
      console.log("StateSEQ", s);
      setStateSEQ(s);
      getQueue(import.meta.env.VITE_CONTRACT_L1, s.pile).then(
        (requests: any[]) => {
          setQueue(requests);
        }
      );
    });
    getState(import.meta.env.VITE_CONTRACT_L1).then((s: StateL1) => {
      setStateL1(s);
    });
  }, []);

  React.useEffect(() => {
    setRebarAmount(arAmount);
  }, [arAmount]);

  console.log(queue);

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
                arProvider.walletAddress && arProvider.availableBalance !== null
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
        {created && (
          <p>Mint created! It should be confirmed in like 20 minutes.</p>
        )}
      </S.Wrapper>

      <S.DetailWrapper>
        {queue && (
          <>
            <S.DHeader>
              <p>{language.requestQueue}</p>
            </S.DHeader>
            {queue.map((tx: any, index: number) => {
              const widthPercentage = 100 / Object.keys(tx[1]).length;
              return (
                <React.Fragment key={index}>
                  <S.DetailSubheader>
                    <p>{tx[0]}</p>
                  </S.DetailSubheader>
                  <S.DetailLine
                    key={index}
                    type={"pending"}
                    ownerLine={
                      arProvider.walletAddress
                        ? arProvider.walletAddress === tx[1].target
                        : false
                    }
                  >
                    <S.DetailValue widthPercentage={widthPercentage}>
                      <p>{`${formatAddress(tx[1].target, false)}`}</p>
                    </S.DetailValue>
                    <S.DetailValue widthPercentage={widthPercentage}>
                      <S.Qty>{`${language.qty}: ${tx[1].qty}`}</S.Qty>
                    </S.DetailValue>
                    <S.DetailValue widthPercentage={widthPercentage}>
                      <p>{`${language.expires}: ${tx[1].expires}`}</p>
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
