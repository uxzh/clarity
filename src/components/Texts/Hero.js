import React from "react";
import "../../output.css";

export default function Hero() {
  return (
    <div>
      <p className="text-center  text-lg font-semibold">Not enough cashback?</p>
      <div>
        <h1
          className="text-4xl font-bold text-center"
          style={{
            textTransform: "uppercase",
            fontWeight: 800,
            fontSize: "4.25em",
            lineHeight: "1em",
          }}
        >
          Make daily purchases earn you free cash
        </h1>
      </div>
    </div>
  );
}
