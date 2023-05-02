import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

import { Button } from "components/atoms/Button";
import { FormField } from "components/atoms/FormField";

import { ASSETS } from "helpers/config";
import { useArweaveProvider } from "providers/ArweaveProvider";

import { language } from "helpers/language";
import * as S from "./styles";
import { getState } from "api";

// TODO: Form field logos
export default function Swap() {
  const arProvider = useArweaveProvider();
  const [state, setState] = useState<any>();

  const [amount, setAmount] = React.useState<number>(0);

  function getAction() {
    if (!arProvider.walletAddress) {
      return (
        <Button
          type={"alt1"}
          label={language.connectWallet}
          handlePress={() => arProvider.setWalletModalVisible(true)}
          height={52.5}
          fullWidth
        />
      );
    } else {
      null;
    }
  }

  useEffect(() => {
    getState(import.meta.env.VITE_CONTRACT_SEQ).then(setState);
  }, []);

  return (
    <S.Wrapper className={"tab-wrapper"}>
      <S.TWrapper>
        <S.DWrapper>
          <h2>{language.swap}</h2>
          <p>{language.swapDescription}</p>
        </S.DWrapper>
        <S.FWrapper>
          <FormField
            type={"number"}
            label={language.from}
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(parseFloat(e.target.value))
            }
            disabled={!arProvider.walletAddress}
            invalid={false}
            endText={"AR"}
          />

          <S.Divider>
            <ReactSVG src={ASSETS.arrowDown} />
          </S.Divider>

          <FormField
            type={"number"}
            label={language.to}
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(parseFloat(e.target.value))
            }
            disabled={true}
            invalid={false}
            endText={"reBAR"}
          />
        </S.FWrapper>
      </S.TWrapper>
      {getAction()}
      <p>Contract ticker: {state?.ticker}</p>
      <p>L1 Mint Contract: {state?.mint_contract}</p>
    </S.Wrapper>
  );
}
