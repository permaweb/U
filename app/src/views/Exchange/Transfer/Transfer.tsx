import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';

import { ASSETS } from 'helpers/config';
import { useArweaveProvider } from 'providers/ArweaveProvider';

import { language } from 'helpers/language';
import * as S from './styles';
import { env } from 'api';

// TODO: Form field logos
export default function Swap() {
  const arProvider = useArweaveProvider();
  const [state, setState] = useState<any>();

  const [qty, setQty] = React.useState<number>(0);
  const [target, setTarget] = React.useState<string | undefined>();

  function getAction() {
    if (!arProvider.walletAddress) {
      return (
        <Button
          type={'alt1'}
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
    env.getState(import.meta.env.VITE_CONTRACT_SEQ).then(setState);
  }, []);

  return (
    <>
      <S.Wrapper className={'tab-wrapper'}>
        <S.TWrapper>
          <S.DWrapper>
            <h2>{language.transfer}</h2>
            <p>{language.transferDescription}</p>
          </S.DWrapper>
          <S.FWrapper>
            <FormField
              label={language.to}
              value={target || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTarget(e.target.value)
              }
              disabled={!arProvider.walletAddress}
              invalid={{ status: false, message: null }}
            />

            <S.Divider>
              <ReactSVG src={ASSETS.arrowDown} />
            </S.Divider>

            <FormField
              type={'number'}
              label={language.amount}
              value={qty}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQty(parseFloat(e.target.value))
              }
              disabled={!target}
              invalid={{ status: false, message: null }}
              logo={ASSETS.rebarLogo}
            />
          </S.FWrapper>
        </S.TWrapper>
        {getAction()}
        {qty > 0 && target && (
          <Button
            type={'alt1'}
            label={language.transfer}
            handlePress={() =>
              env.transfer({
                contractId: import.meta.env.VITE_CONTRACT_SEQ,
                qty,
                target,
              })
            }
            height={52.5}
            fullWidth
          />
        )}
      </S.Wrapper>
      <h1>Balances</h1>
      <p>{JSON.stringify(state?.balances)}</p>
    </>
  );
}
