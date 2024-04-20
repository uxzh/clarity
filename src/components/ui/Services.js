import React from "react";
import ToolsCard from "./ToolsCard";
import Image1 from "../../lib/img/tools/calculate.png";
import Image2 from "../../lib/img/tools/girl.png";
import Image3 from "../../lib/img/tools/transaction.png"; // Assuming this is the image for the savings account
import Image4 from "../../lib/img/tools/chart.png";
import ComingSoon from "../../lib/img/coming-soon.png";

// Assuming this is the image for the investment planning tools
import "../../CSS/Services.css";

export default function Services() {
  return (
    <div
      className="cardtools flex flex-col items-center justify-center"
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <div id="bgbgbg2"></div>
      <div style={{ maxWidth: 800 }}>
        <h2 className="uppercase text-slate-800 mt-14 color text-2xl font-black w-full text-center mb-4">
          Credit Card Tools for You
        </h2>
        <div className="card-container">
          <ToolsCard
            className="card"
            src={ComingSoon}
            title={"Credit Card Reviews"}
          />
          <ToolsCard
            className="card"
            src={ComingSoon}
            title={"Points to Dollars Converter"}
          />
          <ToolsCard
            className="card"
            src={ComingSoon}
            title={"Cashback Investment Calculator"}
          />
          <ToolsCard
            className="card"
            src={ComingSoon}
            title={"Credit Card Comparison Tool"}
          />
        </div>
      </div>
    </div>
  );
}
