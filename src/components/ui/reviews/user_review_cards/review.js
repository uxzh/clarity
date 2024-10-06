import React, { useState, useCallback, useEffect, useContext, useRef } from "react";
import { User, Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { IconThumbUp, IconThumbDown } from "@tabler/icons-react";
import { cn } from "./cn";
import { AuthContext } from "../../../../contexts/AuthContext";

const Review = React.forwardRef(
  (
    {
      children,
      _id,
      user: author,
      title,
      content,
      rating,
      createdAt,
      likedByUser = 0,  // -1 or 0 or 1
      likes: initialLikes = 0,
      dislikes: initialDislikes = 0,
      ...props
    },
    ref
  ) => {
    const [likeStatus, setLikeStatus] = useState(
      likedByUser === 1 ? "like" : likedByUser === -1 ? "dislike" : "none"
    );
    const prevLikeStatusRef = useRef(likeStatus);
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [lastInteraction, setLastInteraction] = useState(null);
    const { api, user } = useContext(AuthContext);

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

    const handleButtonInteraction = (buttonType, isHovered) => {
      setHoveredButton(isHovered ? buttonType : null);
    };

    const handleLikeDislike = (action) => {
      // if user is not logged in, do not allow like/dislike
      if (!user?.isLoggedIn) {
        // TODO: show a modal to prompt user to login
        console.log("Please login in to leave a like/dislike");
        return
      }

      setLikeStatus((prevStatus) => {
        prevLikeStatusRef.current = prevStatus;
        if (prevStatus === action) {
          // If the same button is clicked again, remove the like/dislike
          setLikes((prev) => (action === "like" ? prev - 1 : prev));
          setDislikes((prev) => (action === "dislike" ? prev - 1 : prev));
          return "none";
        } else {
          // If switching from like to dislike or vice versa, update both counts
          if (prevStatus === "like") setLikes((prev) => prev - 1);
          if (prevStatus === "dislike") setDislikes((prev) => prev - 1);

          if (action === "like") setLikes((prev) => prev + 1);
          if (action === "dislike") setDislikes((prev) => prev + 1);

          return action;
        }
      });
      setLastInteraction(Date.now());
    };

    const debouncedApiCall = useCallback(async () => {
      let apiFunc;
      switch (likeStatus) {
        // if button unpressed, remove like/dislike
        case "none":
          apiFunc = () => api.deleteReviewLike(_id);
          break;
        default:
          const prevStatus = prevLikeStatusRef.current;
          if (prevStatus === "none") {
            apiFunc = () => api.likeReview(_id, likeStatus === "like");
          } else {
            apiFunc = () => api.updateReviewLike(_id, likeStatus === "like");
          }
          break;
      }

      try {
        await apiFunc();
      } catch (error) {
        console.error("Error updating like/dislike:", error
      );}
    }, [likeStatus, _id, api]);

    useEffect(() => {
      if (lastInteraction) {
        const timer = setTimeout(() => {
          debouncedApiCall();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [lastInteraction, debouncedApiCall]);

    return (
      <div ref={ref} {...props} className="relative pb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User
              avatarProps={{
                src: author?.avatar,
              }}
              classNames={{
                name: "font-medium",
                description: "text-small",
              }}
              description={formatDate(createdAt)}
              name={author?.username || "Anonymous"}
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
        <div className="absolute bottom-0 right-0 flex items-center">
          <Button
            variant="light"
            onPress={() => handleLikeDislike("like")}
            onMouseEnter={() => handleButtonInteraction("like", true)}
            onMouseLeave={() => handleButtonInteraction("like", false)}
            onTouchStart={() => handleButtonInteraction("like", true)}
            onTouchEnd={() => handleButtonInteraction("like", false)}
            className={cn(
              "transition-colors duration-200 min-w-0 h-auto py-1",
              likeStatus === "like" || hoveredButton === "like"
                ? "text-primary"
                : "text-default-400"
            )}
          >
            <div className="flex items-center px-2">
              <IconThumbUp stroke={2} />
              <span className="ml-1">{likes}</span>
            </div>
          </Button>
          <Button
            variant="light"
            onPress={() => handleLikeDislike("dislike")}
            onMouseEnter={() => handleButtonInteraction("dislike", true)}
            onMouseLeave={() => handleButtonInteraction("dislike", false)}
            onTouchStart={() => handleButtonInteraction("dislike", true)}
            onTouchEnd={() => handleButtonInteraction("dislike", false)}
            className={cn(
              "transition-colors duration-200 min-w-0 h-auto py-1",
              likeStatus === "dislike" || hoveredButton === "dislike"
                ? "text-danger"
                : "text-default-400"
              
            )}
          >
            <div className="flex items-center px-2">
              <IconThumbDown stroke={2} />
              <span className="ml-1">{dislikes}</span>
            </div>
          </Button>
        </div>
      </div>
    );
  }
);

Review.displayName = "Review";

export default Review;
