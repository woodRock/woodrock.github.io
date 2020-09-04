import React from "react";
import logo from "../assets/logo.png";

const Loading = () => {
  const speed = 3;
  return (
    <div className="loading stage">
      <img
        className="square loading-logo"
        style={{
          animation: `spin ${speed}s linear infinite`,
          width: "50px",
          height: "50px",
          borderRadius: "50px",
        }}
        src={logo}
        alt="img"
      />
    </div>
  );
};

export default Loading;
