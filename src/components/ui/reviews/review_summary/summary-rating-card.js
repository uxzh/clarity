import React from "react";
import { Icon } from "@iconify/react";
import { Button, Progress } from "@nextui-org/react";

import { cn } from "./cn";

const SummaryRatingCard = React.forwardRef(
  (
    {
      className,
      ratings,
      totalRatingCount,
      averageRating,
      onWriteReview,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-2 rounded-medium bg-content1 p-6 shadow-small",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Icon className="text-primary-500" icon="solar:star-bold" width={20} />
        <span className="text-large font-semibold">{averageRating}</span>
        <span className="text-default-500">
          • (Based on {totalRatingCount} reviews)
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {ratings.map(({ rating, count }, index) => {
          const percentage = (count / totalRatingCount) * 100;

          return (
            <div key={index} className="flex items-center gap-1">
              <Progress
                showValueLabel
                aria-label={`${rating} stars`}
                color="primary"
                label={
                  <span className="text-small">{`${rating} ${
                    rating > 1 ? "stars" : "star"
                  }`}</span>
                }
                value={percentage}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex w-full flex-col gap-4">
        <Button
          fullWidth
          className="hover:scale-105"
          radius="md"
          color="primary"
          startContent={<Icon icon="solar:pen-bold" />}
          variant="flat"
          onClick={onWriteReview}
        >
          Write a review
        </Button>
        <p className="text-small text-default-500 mx-auto">
          Share your honest experience with other users
        </p>
      </div>
    </div>
  )
);

SummaryRatingCard.displayName = "SummaryRatingCard";

export default SummaryRatingCard;
