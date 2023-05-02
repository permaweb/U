import React from "react";
import parse from "html-react-parser";
import { ReactSVG } from "react-svg";

import { Button } from "components/atoms/Button";
import { FormField } from "components/atoms/FormField";

import { ASSETS } from "helpers/config";
import { useArweaveProvider } from "providers/ArweaveProvider";

import { language } from "helpers/language";
import * as S from "./styles";
import { getState } from "api";

export default function Swap() {
  const arProvider = useArweaveProvider();
  const [state, setState] = React.useState<any>();

  const [amount, setAmount] = React.useState<number>(0);

  function getAction() {
    let action: () => void;
    let disabled: boolean;
    let label: string;

    if (!arProvider.walletAddress) {
      action = () => arProvider.setWalletModalVisible(true);
      disabled = false;
      label = language.connectWallet;
    } else {
      action = () => console.log(amount);
      disabled = amount <= 0 || amount > arProvider.availableBalance!;
      label = language.swap;
    }

    return (
      <Button
        type={"alt1"}
        label={label}
        handlePress={action}
        height={52.5}
        disabled={disabled}
        fullWidth
      />
    );
  }

  function getReBarAmount() {
    return amount;
  }

  React.useEffect(() => {
    getState(import.meta.env.VITE_CONTRACT_SEQ).then(setState);
  }, []);

  return (
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
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(parseFloat(e.target.value))
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
            value={getReBarAmount()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(parseFloat(e.target.value))
            }
            disabled={true}
            invalid={{ status: false, message: null }}
            logo={ASSETS.rebarLogo}
          />
        </S.FWrapper>
      </S.TWrapper>
      <S.AWrapper>{getAction()}</S.AWrapper>
      <p>Contract ticker: {state?.ticker}</p>
      <p>L1 Mint Contract: {state?.mint_contract}</p>
    </S.Wrapper>
  );
}
