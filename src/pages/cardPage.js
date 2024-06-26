import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Chip,
  Spacer,
  Card,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import TopNavbar from "../components/navbar/activeNavbar";
import { FloatingCard } from "../components/ui/floatingCard";
import Component from "../components/ui/reviews/review_summary/summaryRatingCard";
import CardReview from "../components/ui/reviews/user_review_cards/card-review";
import reviews from "../components/ui/reviews/user_review_cards/reviews";
import { IconCreditCardFilled } from "@tabler/icons-react";

const CARD_IMAGE_URL = "https://imgur.com/wYpEo8a.png";

function Review() {
  const { search } = useLocation();
  const { cardId, cardName } = Object.fromEntries(new URLSearchParams(search));

  if (!cardName) {
    return <div>No card selected</div>;
  }

  const validReviews = reviews.filter(
    (review) => Object.keys(review).length > 0
  );
  const hasReviews = validReviews.length > 0;

  const averageRating = hasReviews
    ? (
        validReviews.reduce((acc, review) => acc + (review.rating || 0), 0) /
        validReviews.length
      ).toFixed(1)
    : 0;

  const handleWriteReview = () => {
    // Implement the logic to open the review form or navigate to the review page
    console.log("Write a review clicked");
  };

  return (
    <div className="absolute top-0 z-[-2] min-h-screen w-[100%] bg-slate-100 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,119,198,0.3),rgba(255,255,255,0))]">
      <TopNavbar />
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ======== Left Side ======== */}
            <section className="lg:col-span-2 lg:mt-6 px-2">
              <header className="mb-8 flex flex-wrap items-center justify-between gap-4 md:flex-nowrap md:px-2">
                {hasReviews && (
                  <div className="flex w-full items-center gap-2">
                    <h1 className="text-medium font-semibold md:text-large">
                      Reviews
                    </h1>

                    <div className="flex items-center gap-1">
                      <Icon
                        className="text-primary-500"
                        icon="solar:star-bold"
                        width={20}
                      />
                      <span className="text-medium font-semibold md:text-large">
                        {averageRating}
                      </span>
                      <span className="text-right text-small text-default-500 lg:text-medium">
                        (Based on {validReviews.length} reviews)
                      </span>
                    </div>
                  </div>
                )}
                {hasReviews && (
                  <div className="flex w-full items-center justify-end gap-4">
                    <Input
                      variant="flat"
                      isClearable
                      fullWidth
                      aria-label="Search"
                      className="w-72"
                      labelPlacement="outside"
                      placeholder="Search reviews"
                      startContent={<Icon icon="solar:magnifer-linear" />}
                    />
                    <Select
                      variant="flat"
                      aria-label="Sort by"
                      className="w-40"
                      defaultSelectedKeys={["most_recent"]}
                      labelPlacement="outside"
                    >
                      <SelectItem key="most_recent" value="most_recent">
                        Most recent
                      </SelectItem>
                      <SelectItem key="most_helpful" value="most_helpful">
                        Most helpful
                      </SelectItem>
                      <SelectItem key="highest_rating" value="highest_rating">
                        Highest rating
                      </SelectItem>
                    </Select>
                  </div>
                )}
              </header>
              <div className="flex flex-col gap-4">
                {hasReviews ? (
                  validReviews.map((review, index) => (
                    <CardReview key={index} {...review} />
                  ))
                ) : (
                  <div className="text-center max-w-[500px] mx-auto py-8">
                    <h2 className="text-2xl font-bold mb-4">
                      First Review Opportunity
                    </h2>
                    <p className="text-lg mb-6">
                      Ouch... {cardName} doesn't have any reviews yet. If you're
                      a cardholder, your experience could be valuable to others
                      considering this card.
                    </p>
                    <p className="text-md mb-6 text-gray-600">
                      Honest feedback helps everyone make informed decisions
                      about their finances.
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
            </section>
            {/* ======== Right Side ======== */}
            <section className="lg:col-span-1 lg:sticky lg:top-16 lg:h-screen lg:overflow-y-auto">
              <Card shadow="sm" className="p-4 pt-2 scale-95">
                <FloatingCard
                  imgSrc={CARD_IMAGE_URL}
                  creditCardName={cardName}
                />
                <div>
                  <div className="pl-1">
                    <h2 className="text-2xl font-black">{cardName}</h2>
                    <p className="text-md text-gray-700">Example Bank</p>
                  </div>

                  <Spacer y={4} />
                  <Button
                    style={{ border: "1px solid #1a202c" }}
                    target="_blank"
                    variant="bordered"
                    fullWidth
                    className="shadow-[0px_3px_0px_0px_#1a202c] font-bold hover:scale-105"
                    startContent={<IconCreditCardFilled stroke={1} />}
                  >
                    Apply
                  </Button>

                  <Spacer y={4} />
                  <div className="gap">
                    <Chip variant="flat" className="mr-2" color="success">
                      $200 Cash Back
                    </Chip>
                    <Chip variant="flat">700+ Credit Score</Chip>
                  </div>
                  {hasReviews && (
                    <>
                      <Spacer y={4} />
                      <Component averageRating={averageRating} />
                    </>
                  )}
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
