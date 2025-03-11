import React, {useEffect, useState} from "react";
import {IconStar, IconStarFilled} from "@tabler/icons-react";
import {Button, Progress, useDisclosure} from "@heroui/react";
import {cn} from "./cn";
import FeedbackModal from "../../../FEEDBACK/feedbackModal";
import useAuth from "../../../../hooks/useAuth";
import SignUpModal from "../../signing/SignUpModal";

const SummaryRatingCard = React.forwardRef(
    (
        {className, ratings, totalRatingCount, averageRating, cardName, ...props},
        ref
    ) => {
        const {isOpen, onOpen, onOpenChange} = useDisclosure();
        const {user} = useAuth();
        const [isLoggedIn, setIsLoggedIn] = useState(user?.isLoggedIn);
        const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

        useEffect(() => {
            setIsLoggedIn(user?.isLoggedIn);
        }, [user]);

        useEffect(() => {
            if (isLoggedIn) {
                setIsLoginModalOpen(false);
            }
        }, [isLoggedIn]);

        const handleWriteReview = () => {
            if (isLoggedIn) {
                onOpen();
            } else {
                setIsLoginModalOpen(true);
            }
        };

        const hasReviews = totalRatingCount > 0;

        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col gap-2 rounded-medium bg-content1 p-6 shadow-small",
                    className
                )}
                {...props}
            >
                {hasReviews ? (
                    <>
                        <div className="flex items-center gap-2">
                            <IconStarFilled
                                className="text-primary-500"
                                width={20}
                            />
                            <span className="text-large font-semibold">{averageRating}</span>
                            <span className="text-default-500">
                • (Based on {totalRatingCount} reviews)
              </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {ratings.map(({rating, count}, index) => {
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
                    </>
                ) : (
                    <div className="text-center mb-4">
                        <p className="mb-4">
                            There are no reviews yet, but you can change it!
                        </p>
                        <div
                            style={{
                                width: "100%",
                                cursor: "initial",
                                position: "relative",
                            }}
                        >
                            <img
                                draggable="false"
                                className="mx-auto h-24"
                                alt="no reviews gif"
                                src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3BrYW4xenRwb2puNnpiaWZnZGhnNTczNXBqNGFrM2p6bWJwbm5qMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qQdL532ZANbjy/200w.webp"
                            ></img>
                        </div>
                    </div>
                )}
                <div className="mt-4 flex w-full flex-col gap-4">
                    <Button
                        fullWidth
                        className="hover:scale-105"
                        radius="md"
                        color="primary"
                        startContent={<IconStar/>}
                        variant="flat"
                        onClick={handleWriteReview}
                    >
                        Write a review
                    </Button>
                    <p className="text-small text-default-500 mx-auto">
                        Share your honest experience with other users
                    </p>
                </div>
                <FeedbackModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    cardName={cardName}
                />
                <SignUpModal
                    isOpen={isLoginModalOpen}
                    onClose={() => setIsLoginModalOpen(false)}
                />
            </div>
        );
    }
);

SummaryRatingCard.displayName = "SummaryRatingCard";

export default SummaryRatingCard;
