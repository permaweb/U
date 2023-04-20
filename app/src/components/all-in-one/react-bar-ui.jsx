import React, { useEffect, useState } from "react";
import {
  readState,
  BAR,
  claim as claimBar,
  mint,
} from "@facts-kit/contract-kit";
import Arweave from "arweave";

export function BurnArModel(props) {
  const [wallet, setWallet] = useState("");
  const [amountToMint, setAmountToMint] = useState(0);
  const [amountToTransfer, setAmountToTransfer] = useState(0);
  const [transferTo, setTransferTo] = useState("");
  const [barBalance, setBarBalance] = useState("0.00");
  const [arBalance, setArBalance] = useState("0.00");
  const [action, setAction] = useState("burn");
  const [barState, setBarState] = useState < any > {};

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
      timeout: 60000,
    });
    readState(BAR).then((s) => {
      setBarState(s);
      window.arweaveWallet
        .getActiveAddress()
        .then(async (addr) => {
          setWallet(addr);
          const winston = await arweave.wallets.getBalance(addr);
          const ar = arweave.ar.winstonToAr(winston);
          setArBalance(Number(ar).toFixed(2));
        })
        .catch(console.log);
    });
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center px-4 md:px-0">
      <div className="bg-white md:w-[500px] h-auto rounded-md md:pb-10 pb-4 overflow-hidden w-full ">
        <div className="flex items-center justify-between px-4 py-4   bg-violet-500 text-white">
          <h1 className="text-2xl font-bold text-center">Burn Ar Get bAR</h1>
          <button onClick={() => props.setIsOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between md:px-10 px-8 pt-4">
          <div className="flex flex-start  w-full relative">
            <button
              className={`mx-2 underline ${
                action === "burn" ? `text-purple-500` : "text-gray-500"
              } hover:no-underline`}
              onClick={() => setAction("burn")}
            >
              Burn
            </button>
            <button
              className={`mx-2 underline ${
                action === "transfer" ? `text-purple-500` : "text-gray-500"
              } hover:no-underline`}
              onClick={() => setAction("transfer")}
            >
              Transfer
            </button>
            <button
              className={`mx-2 underline ${
                action === "claim" ? `text-purple-500` : "text-gray-500"
              } hover:no-underline`}
              onClick={() => setAction("claim")}
            >
              Claim
            </button>
          </div>
        </div>

        {action === "burn" && (
          <div
            className="w-full mx-auto min-h-[200px] md:p-10 p-8"
            onSubmit={submitHandler}
          >
            <div className="flex flex-col  w-full relative">
              <label className="text-base font-semibold  text-gray-500">
                Amount of AR to burn
              </label>
              <input
                placeholder="0.00"
                type="number"
                className="w-full border border-gray-300 rounded-md px-4 py-3 mt-2 in-range:outline-lime-500 out-of-range:outline-red-500"
                onChange={(e) => setAmountToMint(e.target.valueAsNumber)}
              />
              <span className="absolute right-2 top-10 bg-white p-1">$AR</span>
            </div>
            <div className="mt-4">
              <p className="text-base font-semibold text-gray-500">
                Your Balances
              </p>
              <p className="text-black flex items-center gap-2 mt-1">
                <span>{arBalance}</span>
                <img
                  src={
                    "https://r2dqto2nh46llibygkn3swre7mjtwx345dvanjjedhppqc4kvxsa.arweave.net/jocJu00_PLWgODKbuVok-xM7X3zo6galJBne-AuKreQ"
                  }
                  alt="ar"
                  width="16px"
                />
              </p>
              <p className="text-black flex items-center gap-2 mt-1">
                <span>
                  {wallet && barState?.balances[wallet]
                    ? (barState?.balances[wallet] / 1000000)?.toFixed(2)
                    : "0.00"}
                </span>
                <img
                  src="https://qkblctkroqeu5ge6njtsrqz57vtajcagc5rgf2b4ynecyt5hnbiq.arweave.net/goKxTVF0CU6YnmpnKMM9_WYEiAYXYmLoPMNILE-naFE"
                  alt="bar"
                  width="16px"
                />
              </p>
            </div>
            <div className="w-full flex items-center mt-6">
              <button
                onClick={() => {
                  console.log("AMOUNT TO MINT", amountToMint);
                  mint(Number(amountToMint), BAR, (state) =>
                    setBarState(state)
                  );
                }}
                className="ml-auto md:text-lg text-base bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500 text-white px-16 py-3 rounded-md shadow-md"
              >
                Burn AR
              </button>
            </div>
          </div>
        )}

        {action === "transfer" && (
          <div className="w-full mx-auto min-h-[200px] md:p-10 p-8">
            <div className="flex flex-col  w-full relative">
              <label
                htmlFor="transfer-amount"
                className="text-base font-semibold  text-gray-500"
              >
                Amount of $bAR to Transfer (disabled)
              </label>
              <input
                id="transfer-amount"
                type="number"
                className="w-full border border-gray-300 rounded-md px-4 py-3 mt-2 in-range:outline-lime-500 out-of-range:outline-red-500"
                placeholder="0.00"
                onChange={(e) => setAmountToTransfer(e.target.valueAsNumber)}
              />
              <span className="absolute right-2 top-10 bg-white p-1">$bAR</span>
            </div>
            <div className="flex flex-col  w-full relative">
              <label
                htmlFor="transfer-to"
                className="text-base font-semibold  text-gray-500"
              >
                Transfer to
              </label>
              <input
                id="transfer-to"
                type="string"
                className="w-full border border-gray-300 rounded-md px-4 py-3 mt-2 in-range:outline-lime-500 out-of-range:outline-red-500"
                placeholder="address"
                onChange={(e) => setTransferTo(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <p className="text-base font-semibold text-gray-500">
                Your Balances
              </p>
              <p className="text-black flex items-center gap-2 mt-1">
                <span>{arBalance}</span>
                <img
                  src={
                    "https://r2dqto2nh46llibygkn3swre7mjtwx345dvanjjedhppqc4kvxsa.arweave.net/jocJu00_PLWgODKbuVok-xM7X3zo6galJBne-AuKreQ"
                  }
                  alt="ar"
                  width="16px"
                />
              </p>
              <p className="text-black flex items-center gap-2 mt-1">
                <span>
                  {wallet && barState?.balances[wallet]
                    ? (barState?.balances[wallet] / 1000000)?.toFixed(2)
                    : "0.00"}
                </span>
                <img
                  src={
                    "https://qkblctkroqeu5ge6njtsrqz57vtajcagc5rgf2b4ynecyt5hnbiq.arweave.net/goKxTVF0CU6YnmpnKMM9_WYEiAYXYmLoPMNILE-naFE"
                  }
                  alt="bar"
                  width="16px"
                />
              </p>
            </div>

            {/* {transferTo && amountToTransfer > 0 && (
              <div className="w-full flex items-center mt-6">
                <button className="ml-auto md:text-lg text-base bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500 text-white px-16 py-3 rounded-md shadow-md">
                  Transfer
                </button>
              </div>
            )} */}
            {/* {(!amountToTransfer || !transferTo) && ( */}
            <div className="w-full flex items-center mt-6">
              <button
                className="ml-auto md:text-lg text-base bg-gray-300 text-white px-16 py-3 rounded-md shadow-md"
                disabled
              >
                Transfer
              </button>
            </div>
            {/* )} */}
          </div>
        )}
        {action === "claim" && (
          <div className="w-full mx-auto min-h-[200px] md:p-10 p-8">
            <div className="flex flex-col  w-full relative">
              <label className="text-base font-semibold  text-gray-500">
                Claims
              </label>
              <table className="table-auto">
                <thead>
                  <tr>
                    <th className="text-left">ID</th>
                    <th className="text-left">qty</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {barState &&
                    barState?.claimable
                      .filter((claim) => claim.to === wallet)
                      .map((claim) => {
                        return (
                          <tr key={claim.txID}>
                            <td>{claim.txID?.slice(-6)}</td>
                            <td>{claim.qty}</td>
                            <td className="float-right">
                              <button
                                onClick={() => {
                                  claimBar(claim, BAR, (state) =>
                                    setBarState(state)
                                  );
                                }}
                                className="ml-auto md:text-lg text-base bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500 text-white px-4 py-3 rounded-md shadow-md"
                              >
                                Claim
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <p className="text-base font-semibold text-gray-500">
                Your Balances
              </p>
              <p className="text-black flex items-center gap-2 mt-1">
                <span>{arBalance}</span>
                <img
                  src={
                    "https://r2dqto2nh46llibygkn3swre7mjtwx345dvanjjedhppqc4kvxsa.arweave.net/jocJu00_PLWgODKbuVok-xM7X3zo6galJBne-AuKreQ"
                  }
                  alt="ar"
                  width="16px"
                />
              </p>
              <p className="text-black flex items-center gap-2 mt-1">
                <span>
                  {wallet && barState?.balances[wallet]
                    ? (barState?.balances[wallet] / 1000000)?.toFixed(2)
                    : "0.00"}
                </span>
                <img
                  src={
                    "https://qkblctkroqeu5ge6njtsrqz57vtajcagc5rgf2b4ynecyt5hnbiq.arweave.net/goKxTVF0CU6YnmpnKMM9_WYEiAYXYmLoPMNILE-naFE"
                  }
                  alt="bar"
                  width="16px"
                />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BurnArModel;
