import React from "react";
import styled from "styled-components";

import Account from "arweave-account";

import { Modal } from "components/molecules/Modal";
import { AR_WALLETS, WALLET_PERMISSIONS } from "helpers/config";
import { getBalanceEndpoint } from "helpers/endpoints";
import { language } from "helpers/language";
import { STYLING } from "helpers/styling";
import { useConnection } from "arweave-wallet-kit";

export const WalletListContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const WalletListItem = styled.button`
  height: 55px;
  width: 100%;
  text-align: left;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-radius: ${STYLING.dimensions.borderRadiusWrapper};
  &:hover {
    background: ${(props) => props.theme.colors.container.primary.hover};
  }
  img {
    width: 30px;
    margin: 0 15px 0 0;
  }
  span {
    font-size: ${(props) => props.theme.typography.size.small};
    margin-top: 2.5px;
  }
`;

interface ArweaveContextState {
  wallets: { name: string; logo: string }[];
  walletAddress: string | null;
  availableBalance: number | null;
  handleConnect: () => void;
  handleDisconnect: () => void;
  walletModalVisible: boolean;
  setWalletModalVisible: (open: boolean) => void;
  arProfile: any;
}

interface ArweaveProviderProps {
  children: React.ReactNode;
}

const DEFAULT_CONTEXT = {
  wallets: [],
  walletAddress: null,
  availableBalance: null,
  handleConnect() {
    console.error(`No Connector Found`);
  },
  handleDisconnect() {
    console.error(`No Connection Found`);
  },
  walletModalVisible: false,
  setWalletModalVisible(_open: boolean) {
    console.error(
      `Make sure to render ArweaveProvider as an ancestor of the component that uses ARContext.Provider`
    );
  },
  arProfile: null,
};

const ARContext = React.createContext<ArweaveContextState>(DEFAULT_CONTEXT);

export function useArweaveProvider(): ArweaveContextState {
  return React.useContext(ARContext);
}

function WalletList(props: { handleConnect: () => void }) {
  return (
    <WalletListContainer>
      {AR_WALLETS.map((wallet, index) => (
        <WalletListItem key={index} onClick={() => props.handleConnect()}>
          <img src={`${wallet.logo}`} alt={""} />
          <span>
            {wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1)}
          </span>
        </WalletListItem>
      ))}
    </WalletListContainer>
  );
}

export function ArweaveProvider(props: ArweaveProviderProps) {
  const wallets = AR_WALLETS;
  const { connect, disconnect } = useConnection();

  const [walletModalVisible, setWalletModalVisible] =
    React.useState<boolean>(false);
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
  const [availableBalance, setAvailableBalance] = React.useState<number | null>(
    null
  );
  const [arProfile, setArProfile] = React.useState<any | null>(null);

  // const [arProfile, setArProfile] = React.useState<ProfileType | null>(null);

  async function handleConnect() {
    connect();
  }

  async function handleDisconnect() {
    await disconnect();
    await window?.arweaveWallet?.disconnect();
    setWalletAddress(null);
  }

  const getUserBalance = async (wallet: string) => {
    const rawBalance = await fetch(getBalanceEndpoint(wallet));
    const jsonBalance = await rawBalance.json();
    return jsonBalance / 1e12;
  };

  React.useEffect(() => {
    async function handleWallet() {
      let walletAddress: string | null = null;
      try {
        walletAddress = await window.arweaveWallet.getActiveAddress();
      } catch {}
      if (walletAddress) {
        setWalletAddress(walletAddress as any);
        setAvailableBalance(await getUserBalance(walletAddress));
      }
    }

    handleWallet();

    window.addEventListener("arweaveWalletLoaded", handleWallet);

    return () => {
      window.removeEventListener("arweaveWalletLoaded", handleWallet);
    };
  });

  React.useEffect(() => {
    (async function () {
      if (walletAddress) {
        const account = await new Account().get(walletAddress);
        if (account) {
          setArProfile(account);
        }
      }
    })();
  }, [walletAddress]);

  return (
    <>
      {walletModalVisible && (
        <Modal
          header={language.connect}
          handleClose={() => setWalletModalVisible(false)}
        >
          <WalletList handleConnect={handleConnect} />
        </Modal>
      )}
      <ARContext.Provider
        value={{
          walletAddress,
          availableBalance,
          handleConnect,
          handleDisconnect,
          wallets,
          walletModalVisible,
          setWalletModalVisible,
          arProfile,
        }}
      >
        {props.children}
      </ARContext.Provider>
    </>
  );
}
