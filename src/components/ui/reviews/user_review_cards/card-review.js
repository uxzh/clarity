import React, {useCallback, useContext, useEffect, useState} from "react";
import {Button, Textarea, Tooltip} from "@nextui-org/react";
import {
    IconCheck,
    IconMessage,
    IconMessageForward,
    IconSquareX,
    IconThumbDown,
    IconThumbUp,
    IconTrashX,
} from "@tabler/icons-react";
import {cn} from "./cn";
import Review from "./review";
import {AuthContext} from "../../../../contexts/AuthContext";
import Reply from "../../replies/Reply";
import RepliesList from "../../replies/RepliesList";

const LikeDislikeButton = ({action, count, isActive, onPress, onHover}) => (
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
                <IconThumbUp stroke={2}/>
            ) : (
                <IconThumbDown stroke={2}/>
            )}
            <span className="ml-1">{count}</span>
        </div>
    </Button>
);

const CardReview = React.forwardRef(
    ({className, onDelete, ...review}, ref) => {
        const {
            _id,
            likedByUser = 0,
            likes: initialLikes = 0,
            dislikes: initialDislikes = 0,
            user: author,
        } = review;

        const [likeStatus, setLikeStatus] = useState(
            likedByUser === 1 ? "like" : likedByUser === -1 ? "dislike" : "none"
        );
        const [likes, setLikes] = useState(initialLikes);
        const [dislikes, setDislikes] = useState(initialDislikes);
        const [hoveredButton, setHoveredButton] = useState(null);
        const [lastInteraction, setLastInteraction] = useState(null);

        const [isReplying, setIsReplying] = useState(false);
        const [replyContent, setReplyContent] = useState("");
        const [cancelConfirmation, setCancelConfirmation] = useState(false);
        const [validationError, setValidationError] = useState("");
        const [deleteConfirmation, setDeleteConfirmation] = useState(false);
        const [deleteTimer, setDeleteTimer] = useState(null);
        const [replies, setReplies] = useState([]);
        const [showReplies, setShowReplies] = useState(false);

        const toggleReplies = () => setShowReplies(prev => !prev);

        const {api, user} = useContext(AuthContext);
        const canInteract =
            user?.isLoggedIn && !user?.isBlocked && user?.emailVerified;

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
            [user, canInteract]
        );
        // Fetch replies on mount
        useEffect(() => {
            const fetchReplies = async () => {
                try {
                    console.log("Fetching replies for reviewId:", _id);
                    const response = await api.getRepliesByReviewId({reviewId: _id});
                    console.log("Fetched replies:", response.data);
                    setReplies(response.data.reverse());
                } catch (error) {
                    console.error("Error fetching replies:", error);
                }
            };
            fetchReplies().then(r => r);
        }, [_id, api]);

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
            if (process.env.NODE_ENV === 'development') {
                console.log("Submitting reply:", replyContent);
            }
            try {
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

        useEffect(() => {
            return () => {
                if (deleteTimer) {
                    clearTimeout(deleteTimer);
                }
            };
        }, [deleteTimer]);

        const replyButton = (
            <Button
                variant=""
                className="font-semibold transform scale-95 opacity-70 transition-all duration-200 hover:scale-100 hover:opacity-100"
                size="sm"
                startContent={<IconMessage stroke={1.5}/>}
                onPress={handleReply}
                isDisabled={!canInteract}
            >
                Reply
            </Button>
        );

        return (
            <>
                <div
                    ref={ref}
                    className={cn(
                        "rounded-medium bg-content1 p-5 shadow-small relative",
                        className
                    )}
                >
                    <Review {...review} />
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
                                        <IconCheck stroke={2}/>
                                    ) : (
                                        <IconTrashX stroke={2}/>
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
                                isActive={likeStatus === "dislike" || hoveredButton === "dislike"}
                                onPress={() => handleLikeDislike("dislike")}
                                onHover={(isHovered) =>
                                    setHoveredButton(isHovered ? "dislike" : null)
                                }
                            />
                        </div>
                    </div>
                </div>
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
                                startContent={<IconSquareX stroke={1.5}/>}
                                onPress={handleCancelReply}
                            >
                                {cancelConfirmation ? "Are you sure?" : "Cancel"}
                            </Button>
                            <Button
                                color="primary"
                                startContent={<IconMessageForward stroke={1.5}/>}
                                onPress={handleSubmitReply}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                )}
                <div className="mt-2 flex flex-col gap-2">
                    {replies.map(reply => (
                        <Reply
                            key={reply._id}
                            reply={reply}
                            canInteract={canInteract}
                            reviewId={_id}
                            setReplies={setReplies}
                            depth={0}
                        />
                    ))}
                </div>
                {showReplies && (
                    <div className={cn("replies-list space-y-4 p-4", className)}>
                        <RepliesList
                            reviewId={_id}
                            replies={replies}
                            setReplies={setReplies}
                            canInteract={canInteract}
                        />
                    </div>
                )}
                <Button
                    variant="light"
                    className="text-xs text-gray-500 p-0 min-w-0 pl-8"
                    size="sm"
                    onPress={toggleReplies}
                >
                    View {replies.length} more {replies.length === 1 ? "reply" : "replies"}
                </Button>
            </>
        );
    }
);

CardReview.displayName = "CardReview";

export default CardReview;
