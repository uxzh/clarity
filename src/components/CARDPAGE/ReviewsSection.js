import { Icon } from "@iconify/react";
import { Button, Input, Select, SelectItem, Card, Pagination } from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import CardReview from "../ui/reviews/user_review_cards/card-review";
import SummaryFromTheWeb from "./from-the-web/summary";

const ReviewsSection = React.memo(
  ({
    reviewFromTheWeb,
    reviews,
    handleWriteReview,
    cardName,
    totalReviewCount,
    reviewsPerPage,
    currentPage,
    selectedFilter,
    handlePageChange,
    handleSelectionChange,
    handleGoBack,
  }) => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-end gap-4">
          <div className="flex items-center">
            <Button
              variant="light"
              isIconOnly
              onClick={handleGoBack}
              className="md:inline-flex bg-white hidden"
            >
              <Icon icon="akar-icons:arrow-left" />
            </Button>

            <h1 className="text-medium font-semibold mx-4 md:text-large hidden md:block">
              Reviews
            </h1>
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center justify-between w-full">
              <Input
                variant="flat"
                isClearable
                aria-label="Search"
                className="w-[60%] md:w-72 ml-[-18px] pr-2"
                labelPlacement="outside"
                placeholder="Search reviews"
                startContent={<Icon icon="solar:magnifer-linear" />}
              />
              <Select
                variant="flat"
                aria-label="Sort by"
                className="w-40"
                selectedKeys={selectedFilter}
                onSelectionChange={handleSelectionChange}
                disallowEmptySelection={true}
              >
                <SelectItem key="most_recent" value="most_recent">
                  Most recent
                </SelectItem>
                <SelectItem key="highest_rating" value="highest_rating">
                  Highest rating
                </SelectItem>
                <SelectItem key="lowest_rating" value="lowest_rating">
                  Lowest rating
                </SelectItem>
              </Select>
            </div>
          )}
        </div>

        {reviews.length > 0 ? (
          <>
            <SummaryFromTheWeb reviewFromTheWeb={reviewFromTheWeb} />
            {reviews.map((review, index) => (
              <CardReview key={index} {...review} />
            ))}
            <Pagination
              total={Math.ceil(totalReviewCount / reviewsPerPage)}
              initialPage={1}
              page={currentPage}
              onChange={handlePageChange}
              className="self-center mt-4"
            />
          </>
        ) : (
          <div className="text-center max-w-[500px] mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">
              First Review Opportunity
            </h2>
            <p className="text-lg mb-6">
              Ouch... {cardName} doesn't have any reviews yet. If you're a
              cardholder, your experience could be valuable to others
              considering this card.
            </p>
            <h2 className="mb-2 font-bold">Here's the summary from the web</h2>
            <SummaryFromTheWeb reviewFromTheWeb={reviewFromTheWeb} />
            <p className="text-md mb-6 mt-4 text-gray-600 ">
              Your feedback helps others make wiser decisions.
            </p>
            <Button
              fullWidth
              className="hover:scale-105 max-w-md mx-auto"
              radius="md"
              color="primary"
              startContent={<Icon icon="solar:pen-bold" />}
              variant="flat"
              onClick={handleWriteReview}
            >
              Write a review
            </Button>
            <p className="text-small text-default-500 mx-auto mt-2">
              Share your honest experience with other users
            </p>
          </div>
        )}
      </div>
    );
  }
);

export default React.memo(ReviewsSection);
