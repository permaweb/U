import React from "react";
import Loader from "./Loader";
import { useValue } from "react-cosmos/client";

export default () => {
  const [status, setstatus] = useValue("status", {
    defaultValue: "on",
  });

  return <Loader status={status} />;
};
