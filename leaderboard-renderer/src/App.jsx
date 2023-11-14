import React, { useEffect, useState } from "react";
import { getState } from "./get-state";
import Loader from "./Loader";
import Leaderboard from "./Leaderboard";
import Error from "./Error";

const LoadingStatus = {
  NOT_LOADED: "NOT_LOADED",
  LOADING: "LOADING",
  LOADED: "LOADED",
  ERROR: "ERROR",
};

const App = () => {
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.NOT_LOADED);
  const [state, setState] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    setLoadingStatus(LoadingStatus.LOADING);
    getState("KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw", "dre-u")
      .then((state) => {
        setState(state);
        setLoadingStatus(LoadingStatus.LOADED);
      })
      .catch((e) => {
        setError(e.message || "Something went wrong.");
        setLoadingStatus(LoadingStatus.ERROR);
      });
  }, []);

  if ([LoadingStatus.NOT_LOADED, LoadingStatus.LOADING].includes(loadingStatus))
    return <Loader />;

  if (loadingStatus === LoadingStatus.ERROR)
    return <Error errorMessage={error} />;

  if (loadingStatus === LoadingStatus.LOADED)
    return <Leaderboard state={state} />;
};

export default App;
