import { useState } from "react";

export function Header(props) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const compressWalletAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4,
      address.length
    )}`;
  };
  return (
    <header className="w-full ">
      <div className="container mx-auto lg:px-4 md:px-5">
        <div className="w-full flex items-center justify-between py-4 lg:px-0 md:px-0 px-3 ">
          <div className="">
            <img
              src="https://n5m5h4626dfuoasdcvl7vmvobkr3pyugbdphyqoybi3kvxycjpca.arweave.net/b1nT89rwy0cCQxVX-rKuCqO34oYI3nxB2Ao2qt8CS8Q"
              alt="logoImg"
              width="150px"
            />
          </div>

          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            type="button"
            className="inline-flex items-center justify-center  p-2 rounded-md ml-auto  text-[#10002B] bg-white 
             lg:hidden md:hidden sm:visible"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {!isNavOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>

          <nav
            className={`lg:relative md:relative absolute right-0 md:bg-transparent bg-white top-[8%] z-10 p-5 md:p-0 md:w-auto w-full   ${
              isNavOpen && !props.isWalletModalOpen ? "visible" : "invisible"
            } lg:visible md:visible`}
          >
            <ul className="flex md:flex-row flex-col items-center ">
              <li className="lg:mr-6 md:mr-6 mr-0  w-full ">
                <button
                  onClick={() => props.setIsBurnArOpen()}
                  className="inline-block md:text-white text-[#7b2cbf] md:text-center text-left border-b-2 border-b-fuchsia-600 
                  hover:border-transparent md:border-transparent
                  md:hover:border-b-fuchsia-600 text-lg  w-full min-w-[90px] md:p-0 pt-2 pb-1"
                >
                  Burn AR
                </button>
              </li>
              <li className="lg:mr-6 mr-0  w-full ">
                <a
                  href="https://get-your-bar-docs.arweave.dev"
                  // href="#"
                  className="inline-block md:text-white text-[#7b2cbf] md:text-center text-left border-b-2 border-b-fuchsia-600 hover:border-transparent md:border-transparent
                     md:hover:border-b-fuchsia-600 text-lg w-full min-w-[110px] md:p-0 pt-2 pb-1"
                >
                  Get Widget
                </a>
              </li>

              <button
                type="button"
                onClick={() => props.setIsWalletModalOpen(true)}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500 shadow-md text-white py-2 px-3 rounded w-full 
                md:hidden mt-4"
              >
                {props.walletAccount?.addr ? (
                  <>
                    <div className="flex items-center gap-2">
                      <img
                        src={props.walletAccount?.profile?.avatarURL}
                        alt="arprofile"
                        width="30px"
                        className="rounded-full bg-white p-[1px]"
                      />
                      {compressWalletAddress(props.walletAccount.addr)}
                    </div>
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => props.setIsWalletModalOpen(true)}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500 shadow-md text-white py-3 px-6 rounded  lg:block md:block hidden"
          >
            {props.walletAccount?.addr ? (
              <>
                <div className="flex items-center gap-2">
                  <img
                    src={props.walletAccount?.profile?.avatarURL}
                    alt="arprofile"
                    width="30px"
                    className="rounded-full bg-white p-[1px]"
                  />
                  {compressWalletAddress(props.walletAccount.addr)}
                </div>
              </>
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
