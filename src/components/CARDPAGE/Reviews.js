import React from "react";
import ReviewSummary from "../ui/reviews/review_summary/summaryRatingCard";

const Reviews = React.memo(({ ratingDistribution, totalReviewCount, cardName }) => (
  <ReviewSummary ratingDistribution={ratingDistribution} cardName={cardName} totalReviewCount={totalReviewCount} />
));

export default React.memo(Reviews);
