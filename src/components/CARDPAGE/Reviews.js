import React from "react";
import ReviewSummary from "../ui/reviews/review_summary/summaryRatingCard";

const Reviews = React.memo(({ reviews, cardName }) => (
  <ReviewSummary reviews={reviews} cardName={cardName} />
));

export default React.memo(Reviews);
