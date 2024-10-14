import React, { useState, useCallback, useEffect, useContext } from "react";
import { Button, Textarea, Tooltip, User } from "@nextui-org/react";
import {
  IconMessage,
  IconThumbUp,
  IconThumbDown,
  IconMessageForward,
  IconSquareX,
} from "@tabler/icons-react";
import { cn } from "./cn";
import Review from "./review";
import { AuthContext } from "../../../../contexts/AuthContext";

// Component for like/dislike buttons
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
  // Destructure review props
  const {
    _id,
    likedByUser = 0,
    likes: initialLikes = 0,
    dislikes: initialDislikes = 0,
    user: author,
  } = review;

  // State for like/dislike functionality
  const [likeStatus, setLikeStatus] = useState(
    likedByUser === 1 ? "like" : likedByUser === -1 ? "dislike" : "none"
  );
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [lastInteraction, setLastInteraction] = useState(null);

  // State for reply functionality
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Get user and API from context
  const { api, user } = useContext(AuthContext);

  // Check if user can interact (logged in, not blocked, email verified)
  const canInteract =
    user?.isLoggedIn && !user?.isBlocked && user?.emailVerified;

  // Handle like/dislike action
  const handleLikeDislike = useCallback(
    (action) => {
      if (!canInteract) {
        console.log(
          "You need to be logged in with a verified email to interact."
        );
        return;
      }

      setLikeStatus((prevStatus) => {
        if (prevStatus === action) {
          // If same action, remove like/dislike
          setLikes((prev) => (action === "like" ? prev - 1 : prev));
          setDislikes((prev) => (action === "dislike" ? prev - 1 : prev));
          return "none";
        } else {
          // If different action, update likes/dislikes accordingly
          if (prevStatus === "like") setLikes((prev) => prev - 1);
          if (prevStatus === "dislike") setDislikes((prev) => prev - 1);
          if (action === "like") setLikes((prev) => prev + 1);
          if (action === "dislike") setDislikes((prev) => prev + 1);
          return action;
        }
      });
      setLastInteraction(Date.now());
    },
    [user, canInteract]
  );

  // Debounced API call for like/dislike
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

  // Effect to trigger debounced API call
  useEffect(() => {
    if (lastInteraction) {
      const timer = setTimeout(debouncedApiCall, 1000);
      return () => clearTimeout(timer);
    }
  }, [lastInteraction, debouncedApiCall]);

  // Handle reply button click
  const handleReply = () => {
    if (!canInteract) {
      console.log("You need to be logged in with a verified email to reply.");
      return;
    }
    setIsReplying(true);
    setReplyContent(`@${author.username || "Anonymous"} `);
  };

  // Handle cancel reply
  const handleCancelReply = () => {
    if (cancelConfirmation) {
      setIsReplying(false);
      setReplyContent("");
      setCancelConfirmation(false);
      setValidationError("");
    } else {
      setCancelConfirmation(true);
    }
  };

  // Handle submit reply
  const handleSubmitReply = () => {
    if (!canInteract) {
      console.log(
        "You need to be logged in with a verified email to submit a reply."
      );
      return;
    }
    if (replyContent.trim().length < 1) {
      setValidationError("Reply must be at least 1 character long");
      return;
    }
    // Logic for submitting reply to server
    console.log("Submitting reply:", replyContent);
    setIsReplying(false);
    setReplyContent("");
    setValidationError("");
  };

  // Effect to handle click outside for cancel confirmation
  useEffect(() => {
    const handleClickOutside = () => {
      if (cancelConfirmation) {
        setCancelConfirmation(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [cancelConfirmation]);

  // Reply button component
  const replyButton = (
    <Button
      variant=""
      className="font-semibold transform scale-95 opacity-70 transition-all duration-200 hover:scale-100 hover:opacity-100"
      size="sm"
      startContent={<IconMessage stroke={1.5} />}
      onPress={handleReply}
      isDisabled={!canInteract}
    >
      Reply
    </Button>
  );

  return (
    <>
      {/* Main review card */}
      <div
        ref={ref}
        className={cn(
          "rounded-medium bg-content1 p-5 shadow-small relative",
          className
        )}
      >
        <Review {...review} />
        {/* Action buttons */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2">
          {canInteract ? (
            replyButton
          ) : (
            <Tooltip content="You need to be logged in with a verified email to reply.">
              {replyButton}
            </Tooltip>
          )}
          <div className="flex gap-2 items-center">
            <LikeDislikeButton
              action="like"
              count={likes}
              isActive={likeStatus === "like" || hoveredButton === "like"}
              onPress={() => handleLikeDislike("like")}
              onHover={(isHovered) =>
                setHoveredButton(isHovered ? "like" : null)
              }
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
      {/* Reply card */}
      {isReplying && (
        <div className="mt-2 rounded-medium bg-content1 p-5 shadow-small relative">
          <Textarea
            fullWidth
            placeholder="Write your reply here..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            status={validationError ? "error" : "default"}
            errorMessage={validationError}
          />
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="light"
              color="danger"
              startContent={<IconSquareX stroke={1.5} />}
              onPress={handleCancelReply}
            >
              {cancelConfirmation ? "Are you sure?" : "Cancel"}
            </Button>
            <Button
              color="primary"
              startContent={<IconMessageForward stroke={1.5} />}
              onPress={handleSubmitReply}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </>
  );
});

CardReview.displayName = "CardReview";

export default CardReview;
