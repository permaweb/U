import React, { useEffect } from "react";
import parse from "html-react-parser";
import { useArweaveProvider } from "providers/ArweaveProvider";

import { Button } from "components/atoms/Button";
import { language } from "helpers/language";
import * as S from "./styles";
import { Claimable, env } from "api";
import { StateSEQ } from "api";

const { getState, getRebarBalance, claim } = env;

// TODO: connectedClaims undefined
export default function Claim() {
  const arProvider = useArweaveProvider();

  const [state, setState] = React.useState<StateSEQ | undefined>();
  const [connectedRebarBalance, setConnectedRebarBalance] = React.useState<
    number | undefined
  >();
  const [connectedClaims, setConnectedClaims] = React.useState<
    Claimable[] | undefined
  >();
  const [connectedRebarBalanceError, setConnectedRebarBalanceError] =
    React.useState<string | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [reBarAmount, setRebarAmount] = React.useState<number>(0);

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
        .catch((e: any) => setConnectedRebarBalanceError(e.message || "Error"));
    }
  }, [state]);

  function getAction() {
    let action: () => void;
    let disabled: boolean;
    let label: string;

    if (!arProvider.walletAddress) {
      disabled = false;
    } else {
      disabled = true;
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

  const claimReBar = async () => {
    console.log("Claim rebar");
  };

  function getClaims() {
    if (connectedClaims) {
      return (
        <>
          {connectedClaims.map((c: any) => {
            return (
              <div key={c.txID}>
                <p style={{ marginTop: 10 }}>From: {c.from}</p>
                <p style={{ marginTop: 10 }}>
                  Quantity: {(c.qty / 1e6).toFixed(2)} RebAR{" "}
                  <span
                    key={c.txID}
                    onClick={() =>
                      claim({
                        qty: c.qty,
                        contractId: import.meta.env.VITE_CONTRACT_SEQ,
                        tx: c.txID,
                      }).then(() => {
                        setConnectedClaims(
                          connectedClaims.filter(
                            (claim) => claim.txID !== c.txID
                          )
                        );
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <u>Claim</u>
                  </span>
                </p>
              </div>
            );
          })}
        </>
      );
    }
    else {
      return <p>Connect a wallet to continue</p>
    }
  }

  return (
    <>
      <S.Wrapper className={"tab-wrapper"}>
        <S.TWrapper>
          <S.DWrapper>
            <h2>{language.claim}</h2>
            <p>{parse(language.claimDescription)}</p>
          </S.DWrapper>
          <S.BWrapper>
            <p>
              <span>{`${language.rebarBalance}: `}</span>
              {`${connectedRebarBalance || "-"}`}
            </p>
          </S.BWrapper>
          <S.CWrapper>
            {!connectedClaims && <p>{language.claimsEmpty}</p>}
            {connectedClaims &&
              connectedClaims?.map((c) => (
                <div key={c.txID}>
                  <p style={{ marginTop: 10 }}>From: {c.from}</p>
                  <p style={{ marginTop: 10 }}>
                    Quantity: {(c.qty / 1e6).toFixed(2)} RebAR{" "}
                    <span
                      key={c.txID}
                      onClick={() =>
                        claim({
                          qty: c.qty,
                          contractId: import.meta.env.VITE_CONTRACT_SEQ,
                          tx: c.txID,
                        }).then(() => {
                          setConnectedClaims(
                            connectedClaims.filter(
                              (claim) => claim.txID !== c.txID
                            )
                          );
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <u>Claim</u>
                    </span>
                  </p>
                </div>
              ))}
          </S.CWrapper>
          <S.AWrapper>{getAction()}</S.AWrapper>
        </S.TWrapper>
      </S.Wrapper>
    </>
  );
}
