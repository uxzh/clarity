import React from "react";
import {User} from "@nextui-org/react";
import {IconStar, IconStarFilled, IconStarHalf, IconStarHalfFilled} from "@tabler/icons-react";

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return isNaN(date.getTime())
        ? "Invalid Date"
        : new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(date);
};

// Component for rendering star rating
const StarRating = ({rating}) => (
    <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
            if (i <= rating - 1) {
                return (
                    <IconStarFilled
                        key={i}
                        className="text-lg sm:text-xl text-primary"
                    />
                );
            } else if (i === Math.floor(rating) && rating % 1 !== 0) {
                return (
                    <IconStarHalfFilled
                        key={i}
                        className="text-lg sm:text-xl text-primary"
                    />
                );
            } else {
                return (
                    <IconStar
                        key={i}
                        className="text-lg sm:text-xl text-default-200 opacity-0.9"
                    />
                );
            }
        })}
    </div>
);

const Review = React.forwardRef(
    (
        {children, user: author, title, content, rating, createdAt, ...props},
        ref
    ) => {
        return (
            <div ref={ref} {...props} className="relative pb-10">
                <div className="flex items-center justify-between">
                    <User
                        avatarProps={{src: author?.avatar}}
                        classNames={{name: "font-medium", description: "text-small"}}
                        description={formatDate(createdAt)}
                        name={author?.username || "Anonymous"}
                    />
                    <StarRating rating={rating}/>
                </div>
                <div className="mt-4 w-full">
                    <p className="font-medium text-default-900">{title || "No Title"}</p>
                    <p className="mt-2 text-default-500">
                        {content || children || "No content"}
                    </p>
                </div>
            </div>
        );
    }
);

Review.displayName = "Review";

export default Review;
