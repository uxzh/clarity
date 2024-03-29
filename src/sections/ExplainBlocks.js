import React from "react";
import { Image } from "@nextui-org/react";
import cardsInHands from "../lib/img/credit_cards_in_hands.png";
import phoneCashback from "../lib/img/phone_received_cashback.png";
import cardsTrophey from "../lib/img/cards_trophey.png";

const ExplainBlock = ({ title, description, imageSrc, reverse }) => {
  return (
    <div className="mx-auto max-w-4xl" id="explanation">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
          reverse ? "md:grid-flow-row-dense" : ""
        }`}
      >
        <div
          className={`flex justify-center md:justify-start ${
            reverse ? "md:order-last" : ""
          }`}
        >
          <Image
            className="w-full md:w-auto"
            style={{ height: 376 }}
            src={imageSrc}
            alt={title}
          />
        </div>
        <div className="flex items-center p-8">
          <div>
            <h2 className="font-black uppercase text-2xl md:text-2xl mb-4">
              {title}
            </h2>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <ExplainBlock
        title="The Struggle is Real"
        description="Let's be honest, keeping track of all those different credit card rewards can be a real headache. Which card gives you the best cashback for groceries? What about gas? And don't even get us started on those annual fees..."
        imageSrc={cardsInHands}
        reverse={false}
      />
      <ExplainBlock
        title="Maximize Your Cashback Rewards"
        description="That's where we come in! Get a clear overview of your cards and see exactly where you're earning (or missing out!). We'll highlight areas for improvement so you can make smarter choices."
        imageSrc={phoneCashback}
        reverse={true}
      />
      <ExplainBlock
        title="Unbiased Card Rankings"
        description="Forget those shady affiliate sites. Our rankings are 100% unbiased, giving you the real scoop on the best cashback cards out there."
        imageSrc={cardsTrophey}
        reverse={false}
      />
    </>
  );
};

export default App;
