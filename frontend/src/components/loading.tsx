import React from "react";
import ReactLoading from "react-loading";
import { RED_PRIMARY } from "../assets/colors";

export const Loading = ():JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "inherit",
        height: "100%",
        width: "100%",
      }}
    >
      <ReactLoading
        type="spin"
        color={RED_PRIMARY}
        width="3rem"
      />
    </div>
  );
}
