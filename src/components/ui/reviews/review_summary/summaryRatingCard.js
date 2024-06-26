import React from "react";

import SummaryRatingCard from "./summary-rating-card.js";

const ratings = [
  {
    rating: 5,
    count: 120,
  },
  {
    rating: 4,
    count: 50,
  },
  {
    rating: 3,
    count: 25,
  },
  {
    rating: 2,
    count: 33,
  },
  {
    rating: 1,
    count: 30,
  },
];

export default function Component({ averageRating }) {
  return (
    <section className="mx-auto w-full max-w-md  ">
      <div className="flex flex-col gap-4">
        <SummaryRatingCard
          averageRating={averageRating}
          ratings={ratings}
          totalRatingCount={139}
        />
      </div>
    </section>
  );
}
