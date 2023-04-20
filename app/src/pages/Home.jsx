import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { mapStateToProps, router } from "../pages";
import { ArweaveWebWallet } from "arweave-wallet-connector";
import ConnectWallet from "../components/connect-wallet/connect-wallet";
import Account from "arweave-account";
import Arweave from "arweave";
import { BurnArModel } from "../components/all-in-one/react-bar-ui";

import Header from "../components/header/header";

function Home(props) {
  const { goToPlayer } = props;
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isBurnArOpen, setIsBurnArOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [walletAccount, setWalletAccount] = useState(null);
  const [balances, setBalances] = useState({});

  // configuring Arweave instance
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 60000,
  });

  // Wallet Connect
  const arconnect = async () => {
    try {
      if (address) {
        setIsWalletModalOpen(false);
      } else {
        if (!window.arweaveWallet) {
          window.open("https://arconnect.io", "_blank");
        }
        await window.arweaveWallet.connect(
          ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
          {
            name: "Burn AR",
          }
        );

        setAddress(await window.arweaveWallet.getActiveAddress());
        setIsWalletModalOpen(false);
      }
    } catch (error) {
      console.log(`Error in Connecting with ArConnect: ${error}`);
    }
  };

  const arwallet = async () => {
    try {
      const wallet = new ArweaveWebWallet({
        name: "img",
      });
      wallet.setUrl("arweave.app");
      await wallet.connect();
      const addr = await window.arweaveWallet.getActiveAddress();
      setAddress(addr);
      setIsWalletModalOpen(false);
    } catch (error) {
      console.log(`Error in Connecting with ArWallet: ${error}`);
    }
  };

  useEffect(() => {
    const account = new Account({
      cacheIsActivated: true,
      cacheSize: 100,
      cacheTime: 3600000,
    });

    if (address) {
      account
        .get(address)
        .then((a) => setWalletAccount(a))
        .catch(console.log);
    }
  }, [address]);

  return (
    <section
      style={{
        background:
          "url(https://ves46ii7zn5ch32eoei5hd7ou5glp5ynvp27az337bws5y7yehka.arweave.net/qSXPIR_LeiPvRHER04_up0y39w2r9fBne_htLuP4IdQ)",
        backgroundRepeat: "no-repeat",
      }}
      className="bg-cover min-h-screen bg-opacity-80 relative"
    >
      <Header
        isWalletModalOpen={isWalletModalOpen}
        setIsWalletModalOpen={setIsWalletModalOpen}
        walletAccount={walletAccount}
        setIsBurnArOpen={() => setIsBurnArOpen(true)}
      />

      <div className="container mx-auto lg:px-4 px-2">
        <div className="w-full lg:flex lg:flex-row items-center justify-between md:flex md:flex-col-reverse flex flex-col-reverse   mt-[10%] md:mt-[5%] ">
          <div className="xl:w-1/3 lg:w-1/2 md:w-9/12 md:text-center text-left lg:text-left  py-5 px-3 lg:px-0 md:px-0 md:mr-12 mr-0">
            <h1 className="text-4xl font-bold text-white">
              BURN AR, RECEIVE BAR
            </h1>
            <p className="font-light text-xl text-fuchsia-400 mt-4 leading-8 md:text-fuchsia-300">
              A scarce medium of exchange for the SmartWeave ecosystem. Upload
              data or burn AR to get bAR. No bridges, no treasury to hack. Many
              applications use it as application fuel.
            </p>
            <p className="font-light text-xl mt-4 leading-8 text-fuchsia-400 md:text-fuchsia-300">
              Don't trust,{" "}
              <a
                href="#"
                className="border-b-2 hover:border-transparent border-b-fuchsia-600 pb-2"
              >
                audit yourself
              </a>
              . It is 120 lines.
            </p>

            <button
              type="button"
              onClick={() => setIsBurnArOpen(true)}
              className="md:text-lg text-base bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500 text-white px-10  py-3 rounded-md mt-10 shadow-md md:mr-5"
            >
              Start Burning AR
            </button>
          </div>

          <img
            src="https://k5mbyjcewoeen5kyb46nshcrzj7ezdqmommzwbgcwbp2kjxju6cq.arweave.net/V1gcJESziEb1WA882RxRyn5MjgxzGZsEwrBfpSbpp4U"
            alt="conversionImg"
            className="drop-shadow-lg xl:w-[500px] lg:w-[450px] md:w-[500px] w-[300px] "
          />
        </div>
      </div>

      {isWalletModalOpen ? (
        <ConnectWallet
          isWalletModalOpen={isWalletModalOpen}
          setIsWalletModalOpen={setIsWalletModalOpen}
          ArConnect={arconnect}
          ArWallet={arwallet}
        />
      ) : null}

      {isBurnArOpen ? (
        <BurnArModel isOpen={isBurnArOpen} setIsOpen={setIsBurnArOpen} />
      ) : null}
    </section>
  );
}
export default connect(mapStateToProps, router)(Home);
