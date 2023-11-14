import React from "react";
import Error from "./Error";
import { useValue } from "react-cosmos/client";

export default () => {
  const [errorMessage, seterrorMessage] = useValue("errorMessage", {
    defaultValue: "some error message",
  });

  return <Error errorMessage={errorMessage} />;
};
