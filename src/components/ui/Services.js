import React from "react";
import ToolsCard from "./ToolsCard";
import Image1 from "../../lib/img/tools/calculate.png";
import Image2 from "../../lib/img/tools/girl.png";
import Image3 from "../../lib/img/tools/transaction.png"; // Assuming this is the image for the savings account
import Image4 from "../../lib/img/tools/chart.png"; // Assuming this is the image for the investment planning tools
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
            src={Image1}
            title={"Personalized Budgeting Assistance"}
          />
          <ToolsCard
            className="card"
            src={Image2}
            title={"Youth-Focused Savings Accounts"}
          />
          <ToolsCard
            className="card"
            src={Image3}
            title={"Investment Education Resources"}
          />
          <ToolsCard
            className="card"
            src={Image3}
            title={"Financial Objective Planning Tools"}
          />
        </div>
      </div>
    </div>
  );
}
