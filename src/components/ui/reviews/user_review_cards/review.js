import React from "react";
import { User } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { cn } from "./cn";

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
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Icon
        key={i}
        className={cn(
          "text-lg sm:text-xl",
          i < rating ? "text-primary" : "text-default-200"
        )}
        icon="solar:star-bold"
      />
    ))}
  </div>
);

const Review = React.forwardRef(
  (
    { children, user: author, title, content, rating, createdAt, ...props },
    ref
  ) => {
    return (
      <div ref={ref} {...props} className="relative pb-10">
        <div className="flex items-center justify-between">
          <User
            avatarProps={{ src: author?.avatar }}
            classNames={{ name: "font-medium", description: "text-small" }}
            description={formatDate(createdAt)}
            name={author?.username || "Anonymous"}
          />
          <StarRating rating={rating} />
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
