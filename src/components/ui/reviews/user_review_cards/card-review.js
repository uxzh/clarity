import React, { useState, useCallback, useEffect, useContext } from "react";
import { Button } from "@nextui-org/react";
import { IconMessage, IconThumbUp, IconThumbDown } from "@tabler/icons-react";
import { cn } from "./cn";
import Review from "./review";
import { AuthContext } from "../../../../contexts/AuthContext";

const LikeDislikeButton = ({ action, count, isActive, onPress, onHover }) => (
  <Button
    isIconOnly
    variant="light"
    onPress={onPress}
    onMouseEnter={() => onHover(true)}
    onMouseLeave={() => onHover(false)}
    onTouchStart={() => onHover(true)}
    onTouchEnd={() => onHover(false)}
    className={cn(
      "transition-all duration-200 min-w-0 transform scale-95 opacity-70 hover:scale-100 hover:opacity-100",
      isActive
        ? action === "like"
          ? "text-primary"
          : "text-danger"
        : "text-default-400"
    )}
  >
    <div className="flex items-center">
      {action === "like" ? (
        <IconThumbUp stroke={2} />
      ) : (
        <IconThumbDown stroke={2} />
      )}
      <span className="ml-1">{count}</span>
    </div>
  </Button>
);

const CardReview = React.forwardRef(({ className, ...review }, ref) => {
  const {
    _id,
    likedByUser = 0,
    likes: initialLikes = 0,
    dislikes: initialDislikes = 0,
  } = review;
  const [likeStatus, setLikeStatus] = useState(
    likedByUser === 1 ? "like" : likedByUser === -1 ? "dislike" : "none"
  );
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [lastInteraction, setLastInteraction] = useState(null);
  const { api, user } = useContext(AuthContext);

  const handleLikeDislike = useCallback(
    (action) => {
      if (!user?.isLoggedIn) {
        console.log("Please login to leave a like/dislike");
        return;
      }

      setLikeStatus((prevStatus) => {
        if (prevStatus === action) {
          setLikes((prev) => (action === "like" ? prev - 1 : prev));
          setDislikes((prev) => (action === "dislike" ? prev - 1 : prev));
          return "none";
        } else {
          if (prevStatus === "like") setLikes((prev) => prev - 1);
          if (prevStatus === "dislike") setDislikes((prev) => prev - 1);
          if (action === "like") setLikes((prev) => prev + 1);
          if (action === "dislike") setDislikes((prev) => prev + 1);
          return action;
        }
      });
      setLastInteraction(Date.now());
    },
    [user]
  );

  const debouncedApiCall = useCallback(async () => {
    const apiFunc =
      likeStatus === "none"
        ? () => api.deleteReviewLike(_id)
        : () => api.likeReview(_id, likeStatus === "like");

    try {
      await apiFunc();
    } catch (error) {
      console.error("Error updating like/dislike:", error);
    }
  }, [likeStatus, _id, api]);

  useEffect(() => {
    if (lastInteraction) {
      const timer = setTimeout(debouncedApiCall, 1000);
      return () => clearTimeout(timer);
    }
  }, [lastInteraction, debouncedApiCall]);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-medium bg-content1 p-5 shadow-small relative",
        className
      )}
    >
      <Review {...review} />
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2">
        <Button
          variant=""
          className="font-semibold transform scale-95 opacity-70 transition-all duration-200 hover:scale-100 hover:opacity-100"
          size="sm"
          startContent={<IconMessage stroke={1.5} />}
        >
          Reply
        </Button>
        <div className="flex gap-2 items-center">
          <LikeDislikeButton
            action="like"
            count={likes}
            isActive={likeStatus === "like" || hoveredButton === "like"}
            onPress={() => handleLikeDislike("like")}
            onHover={(isHovered) => setHoveredButton(isHovered ? "like" : null)}
          />
          <LikeDislikeButton
            action="dislike"
            count={dislikes}
            isActive={likeStatus === "dislike" || hoveredButton === "dislike"}
            onPress={() => handleLikeDislike("dislike")}
            onHover={(isHovered) =>
              setHoveredButton(isHovered ? "dislike" : null)
            }
          />
        </div>
      </div>
    </div>
  );
});

CardReview.displayName = "CardReview";

export default CardReview;
