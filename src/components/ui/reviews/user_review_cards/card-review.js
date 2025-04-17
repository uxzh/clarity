import React, { useState, useCallback, useEffect, useContext } from "react";
import { Button, Textarea, Tooltip, User } from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import {
    IconMessages,
    IconThumbUp,
    IconThumbDown,
    IconMessageForward,
    IconSquareX,
    IconTrashX,
    IconCheck,
} from "@tabler/icons-react";
import { cn } from "./cn";
import Review from "./review";
import { AuthContext } from "../../../../contexts/AuthContext";
import RepliesList from "../../replies/RepliesList";

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

const CardReview = React.forwardRef(
    ({ className, onDelete, ...review }, ref) => {
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
        const [deleteConfirmation, setDeleteConfirmation] = useState(false);
        const [deleteTimer, setDeleteTimer] = useState(null);
        const [replies, setReplies] = useState([]);
        const [showReplies, setShowReplies] = useState(false); // P1b7e

        // Get user and API from context
        const { api, user } = useContext(AuthContext);

        // Check if user can interact (logged in, not blocked, email verified)
        const canInteract =
            user?.isLoggedIn && !user?.isBlocked && user?.emailVerified;

        // Updated user comparison logic
        const isUserReview = Boolean(
            user?.isLoggedIn &&
            user?._id &&
            (author?._id === user._id || review.userId === user._id)
        );

        const handleLikeDislike = useCallback(
            (action) => {
                if (!canInteract) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(
                            "You need to be logged in with a verified email to interact."
                        );
                    }
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
                if (process.env.NODE_ENV === 'development') {
                    console.log("You need to be logged in with a verified email to reply.");
                }
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
        const handleSubmitReply = async () => {
            if (!canInteract) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        "You need to be logged in with a verified email to submit a reply."
                    );
                }
                return;
            }
            if (replyContent.trim().length < 1) {
                setValidationError("Reply must be at least 1 character long");
                return;
            }
            // Logic for submitting reply to server
            if (process.env.NODE_ENV === 'development') {
                console.log("Submitting reply:", replyContent);
            }
            try {
                // Submit reply to server
                const response = await api.createReply({
                    reviewId: _id,
                    content: replyContent.trim(),
                });
                if (process.env.NODE_ENV === 'development') {
                    console.log("Reply submitted:", response);
                }
                setReplies((prevReplies) => [...prevReplies, response.data]);
            } catch (error) {
                console.error("Error submitting reply:", error);
            }

            setReplyContent("");
            setIsReplying(false);
            setValidationError("");
        };

        // Handle delete with confirmation
        const handleDelete = async () => {
            if (!deleteConfirmation) {
                setDeleteConfirmation(true);
                const timer = setTimeout(() => {
                    setDeleteConfirmation(false);
                }, 3000);
                setDeleteTimer(timer);
                return;
            }

            try {
                clearTimeout(deleteTimer);
                if (process.env.NODE_ENV === 'development') {
                    console.log("Deleting review:", _id);
                }
                await api.deleteReview(_id);
                if (onDelete) {
                    onDelete(_id);
                }
            } catch (error) {
                console.error("Error deleting review:", error);
            } finally {
                setDeleteConfirmation(false);
                setDeleteTimer(null);
            }
        };

        // Cleanup timer on unmount
        useEffect(() => {
            return () => {
                if (deleteTimer) {
                    clearTimeout(deleteTimer);
                }
            };
        }, [deleteTimer]);

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

        // Show replies button component
        const showRepliesButton = (
            <Button
                variant=""
                className="font-semibold transform scale-95 opacity-70 transition-all duration-200 hover:scale-100 hover:opacity-100"
                size="sm"
                startContent={<IconMessages stroke={2} />}
                onPress={() => setShowReplies((prev) => !prev)}
            >
                {replies.length === 0 ? null : showReplies ? `Hide Replies` : `Show ${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}`}
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
                        <div className="flex gap-2">
                            {isUserReview && (
                                <Button
                                    isIconOnly
                                    variant="light"
                                    className={cn(
                                        "transition-all duration-200 min-w-0 transform scale-95 opacity-70 hover:scale-100 hover:opacity-100 hover:text-danger",
                                        deleteConfirmation ? "text-danger" : "text-default-400"
                                    )}
                                    onPress={handleDelete}
                                >
                                    {deleteConfirmation ? (
                                        <IconCheck stroke={2} />
                                    ) : (
                                        <IconTrashX stroke={2} />
                                    )}
                                </Button>
                            )}
                            {canInteract ? (
                                replyButton
                            ) : (
                                <Tooltip content="You need to be logged in with a verified email to reply.">
                                    {replyButton}
                                </Tooltip>
                            )}
                            {replies.length > 0 && showRepliesButton}
                        </div>
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
                                isActive={
                                    likeStatus === "dislike" || hoveredButton === "dislike"
                                }
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
                {/* Replies list */}
                {showReplies && (
                    <div>
                        <RepliesList
                            reviewId={_id}
                            replies={replies}
                            setReplies={setReplies}
                            canInteract={canInteract}
                        />
                    </div>
                )}
            </>
        );
    }
);

CardReview.displayName = "CardReview";

export default CardReview;
