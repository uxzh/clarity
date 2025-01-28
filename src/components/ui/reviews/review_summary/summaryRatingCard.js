import React, {useMemo} from "react";
import SummaryRatingCard from "./summary-rating-card.js";

export default function Component({ratingDistribution, cardName, totalReviewCount}) {
    const {averageRating, ratings, totalRatingCount} = useMemo(() => {
        const ratingCounts = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        };

        let totalRating = 0;
        let halfRatingCount = 0;
        let halfRatingTotal = 0;
        ratingDistribution?.forEach(({_id, count}) => {
            if (_id % 1 !== 0) {
                halfRatingCount += count;
                halfRatingTotal += _id * count;
            } else {
                ratingCounts[_id] += count;
                totalRating += _id * count;
            }
        });
        if (halfRatingCount > 0) {
            const RoundedHalfRating = Math.round(halfRatingTotal / halfRatingCount);
            ratingCounts[RoundedHalfRating] += halfRatingCount;
            totalRating += halfRatingTotal;
        }

        const totalCount = totalReviewCount;
        const avgRating =
            totalCount > 0 ? (totalRating / totalCount).toFixed(1) : 0;

        const ratingsArray = Object.entries(ratingCounts)
            .map(([rating, count]) => ({
                rating: parseInt(rating),
                count,
            }))
            .sort((a, b) => b.rating - a.rating);

        return {
            averageRating: avgRating,
            ratings: ratingsArray,
            totalRatingCount: totalCount,
        };
    }, [ratingDistribution, totalReviewCount]);

    return (
        <section className="mx-auto w-full max-w-md">
            <div className="flex flex-col gap-4">
                <SummaryRatingCard
                    averageRating={averageRating}
                    ratings={ratings}
                    totalRatingCount={totalRatingCount}
                    cardName={cardName}
                />
            </div>
        </section>
    );
}
