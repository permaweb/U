export function ConnectWallet(props) {
  const closeWalletModal = () => {
    props.setIsWalletModalOpen(false);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center md:px-0 px-4">
      <div className="bg-white md:w-[500px] h-auto rounded-md pb-10 overflow-hidden w-full  ">
        <div className="flex items-center justify-between px-4 py-4 bg-violet-500 text-white">
          <h1 className="text-2xl font-bold text-center">Connect Wallet</h1>
          <button onClick={() => props.setIsWalletModalOpen(false)}>
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

        <div className="flex flex-col items-center justify-between w-4/6 mx-auto min-h-[200px]  mt-10">
          <button
            onClick={props.ArConnect}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500 text-white md:px-16 md:py-4 px-8 py-3 rounded-md shadow-md"
          >
            Connect with ArConnect
          </button>

          <span>or</span>

          <button
            onClick={props.ArWallet}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500 text-white md:px-16 md:py-4 px-8 py-3 rounded-md shadow-md"
          >
            Connect with Arweave.app
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectWallet;
