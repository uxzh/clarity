import React, { useEffect, useRef } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import Reviews from "./Reviews";
import Cashback from "./Cashback";
import Perks from "./Perks";
import More from "./More";

const CardDetails = ({
  selectedTab,
  handleTabChange,
  cardData,
  averageRating,
  reviews,
}) => {
  const containerRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const handleResize = (entries) => {
      for (let entry of entries) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Resized:", entry.target);
        }
      }
    };

    resizeObserverRef.current = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="flex flex-col" ref={containerRef}>
      <Tabs
        size="lg"
        disableAnimation
        disableCursorAnimation
        aria-label="Card benefits"
        className="w-full transform-gpu mx-auto justify-center"
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
      >
        <Tab key="reviews" title="Reviews" />
        <Tab key="cashback" title="Cashback" />
        <Tab key="perks" title="Perks" />
        <Tab key="more" title="More" />
      </Tabs>

      <div className="mt-4">
        {selectedTab === "reviews" && (
          <Reviews reviews={reviews} cardName={cardData.cardName} />
        )}

        {selectedTab === "cashback" && (
          <Cashback cashbackPercentages={cardData.cashbackPercentages} />
        )}
        {selectedTab === "perks" && (
          <Perks
            perks={cardData.perks}
            redemptionOptions={cardData.redemptionOptions}
          />
        )}
        {selectedTab === "more" && <More cardData={cardData} />}
      </div>
    </div>
  );
};

export default React.memo(CardDetails);
