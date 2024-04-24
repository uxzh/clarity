import React from "react";

import RatingRadioGroup from "./rating-radio-group.tsx";

export default function Stars({ cardRating, reviewsNmbr, starsNmbr }) {
  return (
    <div className="max-w-fit">
      {/* <h3 className="text-medium font-medium leading-8 text-default-600">
        Property Rating
      </h3> */}

      <RatingRadioGroup
        cardRating={cardRating}
        reviewsNmbr={reviewsNmbr}
        starsNmbr={starsNmbr}
        className="w-72"
      />
    </div>
  );
}
