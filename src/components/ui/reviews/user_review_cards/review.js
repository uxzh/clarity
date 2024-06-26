import React from "react";
import { User } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { cn } from "./cn";

const Review = React.forwardRef(
  ({ children, user, title, content, rating, createdAt, ...props }, ref) => {
    const formatDate = (dateString) => {
      if (!dateString) return "Unknown Date";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date);
    };

    return (
      <div ref={ref} {...props}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User
              avatarProps={{
                src: user?.avatar,
              }}
              classNames={{
                name: "font-medium",
                description: "text-small",
              }}
              description={formatDate(createdAt)}
              name={user?.name || "Anonymous"}
            />
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => {
              const isSelected = i + 1 <= (rating || 0);

              return (
                <Icon
                  key={i}
                  className={cn(
                    "text-lg sm:text-xl",
                    isSelected ? "text-primary" : "text-default-200"
                  )}
                  icon="solar:star-bold"
                />
              );
            })}
          </div>
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
