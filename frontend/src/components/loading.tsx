import React from "react";
import ReactLoading from "react-loading";
import { RED_PRIMARY } from "../assets/colors";

export const Loading = () => {
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
        type="spinningBubbles"
        color={RED_PRIMARY}
        height="10%"
        width="10%"
      />
    </div>
  );
}
