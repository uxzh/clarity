import React, { useCallback, useContext, useState } from "react";
import { Button, Textarea, User } from "@nextui-org/react";
import {
    IconMessage,
    IconMessageForward,
    IconSquareX,
    IconThumbDown,
    IconThumbUp,
} from "@tabler/icons-react";
import { AuthContext } from "../../../contexts/AuthContext";
import { cn } from "./cn";

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
            {action === "like" ? <IconThumbUp stroke={2} /> : <IconThumbDown stroke={2} />}
            <span className="ml-1">{count}</span>
        </div>
    </Button>
);

const Reply = React.memo(
    ({ reply, canInteract, reviewId, setReplies, depth = 0 }) => {
        const {
            user,
            _id,
            content,
            createdAt,
            likes = 0,
            dislikes = 0,
            replies = [],
            parentReplyId,
        } = reply;

        const author = user || {};

        console.log('[DEBUG_LOG] Reply author data:', {
            authorObject: author,
            authorKeys: Object.keys(author),
            username: author.username,
            avatar: author.avatar,
            _id: author._id
        });
        const { api, user: currentUser } = useContext(AuthContext);

        const [likeStatus, setLikeStatus] = useState("none"); // Tracks current user's vote
        const [likeCount, setLikeCount] = useState(likes);
        const [dislikeCount, setDislikeCount] = useState(dislikes);
        const [hoveredButton, setHoveredButton] = useState(null);
        const [isReplying, setIsReplying] = useState(false);
        const [replyContent, setReplyContent] = useState("");
        const [cancelConfirmation, setCancelConfirmation] = useState(false);
        const [validationError, setValidationError] = useState("");
        const [showReplies, setShowReplies] = useState(false);

        const simplifiedDateFormat = (dateString) => {
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

        const handleLikeDislike = useCallback(
            async (action) => {
                if (!canInteract) {
                    console.log("You need to be logged in with a verified email to interact.");
                    return;
                }

                const isLikeAction = action === "like";
                const prevLikeStatus = likeStatus;
                const prevLikeCount = likeCount;
                const prevDislikeCount = dislikeCount;

                // Optimistic UI update: Toggle only the user's vote, not overriding totals
                if (prevLikeStatus === action) {
                    // Undo the current user's vote
                    setLikeStatus("none");
                    setLikeCount((prev) => prev - (isLikeAction ? 1 : 0));
                    setDislikeCount((prev) => prev - (!isLikeAction ? 1 : 0));
                } else {
                    // Add or switch the user's vote
                    setLikeStatus(action);
                    setLikeCount((prev) => prev + (isLikeAction ? 1 : (prevLikeStatus === "like" ? -1 : 0)));
                    setDislikeCount((prev) => prev + (!isLikeAction ? 1 : (prevLikeStatus === "dislike" ? -1 : 0)));
                }

                try {
                    const response = await api[isLikeAction ? "likeReply" : "dislikeReply"](_id);
                    const { likes, dislikes } = response.data;

                    // Update state with server totals
                    setReplies((prevReplies) => {
                        if (!parentReplyId) {
                            return prevReplies.map((r) =>
                                r._id === _id ? { ...r, likes, dislikes } : r
                            );
                        }
                        return prevReplies.map((r) => ({
                            ...r,
                            replies: r.replies.map((child) =>
                                child._id === _id ? { ...child, likes, dislikes } : child
                            ),
                        }));
                    });

                    setLikeCount(likes);
                    setDislikeCount(dislikes);
                    setLikeStatus(prevLikeStatus === action ? "none" : action);
                } catch (error) {
                    console.error(`Error ${action}ing reply:`, error);
                    setLikeStatus(prevLikeStatus);
                    setLikeCount(prevLikeCount);
                    setDislikeCount(prevDislikeCount);
                }
            },
            [canInteract, likeStatus, likeCount, dislikeCount, _id, api, parentReplyId, setReplies]
        );

        const handleReply = useCallback(() => {
            if (!canInteract) {
                console.log("You need to be logged in with a verified email to reply.");
                return;
            }
            setIsReplying(true);
            setReplyContent(`@${author?.username || "Anonymous"} `);
        }, [canInteract, author?.username]);

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
            if (!canInteract || replyContent.trim().length < 1) {
                setValidationError("Reply must be at least 1 character long");
                return;
            }
            try {
                console.log("Submitting nested reply:", {
                    reviewId,
                    content: replyContent.trim(),
                    parentReplyId: _id,
                    currentUser: { id: currentUser._id, username: currentUser.username }
                });

                const response = await api.createReply({
                    reviewId,
                    content: replyContent.trim(),
                    parentReplyId: _id,
                });

                console.log("Nested reply response:", response.data);

                setReplies((prevReplies) => {
                    // Recursive function to update replies at any depth
                    const updateRepliesRecursively = (replies) => {
                        return replies.map((r) => {
                            if (r._id === _id) {
                                // Check if this reply already has the new reply
                                if (r.replies && r.replies.some((sub) => sub._id === response.data._id)) {
                                    return r;
                                }
                                // Add the new reply to this reply's replies array
                                return {
                                    ...r,
                                    replies: [response.data, ...(r.replies || [])],
                                };
                            } else if (r.replies && r.replies.length > 0) {
                                // Recursively check nested replies
                                return {
                                    ...r,
                                    replies: updateRepliesRecursively(r.replies),
                                };
                            }
                            return r;
                        });
                    };

                    const updatedReplies = updateRepliesRecursively(prevReplies);
                    console.log("Updated replies state:", updatedReplies);
                    return updatedReplies;
                });

                setReplyContent("");
                setIsReplying(false);
                setValidationError("");
                setShowReplies(true);
            } catch (error) {
                console.error("Error submitting reply:", error);
            }
        };

        const toggleReplies = () => {
            setShowReplies((prev) => !prev);
        };

        return (
            <div className={cn("reply relative mt-2", 
                depth === 0 ? "pl-8" : 
                depth === 1 ? "pl-16" : 
                depth === 2 ? "pl-24" : 
                "pl-24")}>
                <div className={cn("rounded-medium bg-content1 p-4 shadow-small w-full")}>
                    <div className="flex items-start">
                        <User
                            avatarProps={{ src: author?.avatar || "", size: "sm" }}
                            name={author?.username ? `@${author.username}` : "Anonymous"}
                            description={simplifiedDateFormat(createdAt)}
                            classNames={{
                                name: "text-sm font-medium",
                                description: "text-xs text-gray-500",
                            }}
                        />
                    </div>
                    <p className="mt-1 text-default-600 text-sm">{content}</p>
                    <div className="flex justify-end items-center mt-1 pb-1">
                        <div className="flex gap-2 items-center">
                            <Button
                                variant="light"
                                className="text-xs text-gray-500 p-0 min-w-0"
                                size="sm"
                                startContent={<IconMessage stroke={1.5} size={16} />}
                                onPress={handleReply}
                                isDisabled={!canInteract}
                            >
                                Reply
                            </Button>
                            <LikeDislikeButton
                                action="like"
                                count={likeCount}
                                isActive={likeStatus === "like" || hoveredButton === "like"}
                                onPress={() => handleLikeDislike("like")}
                                onHover={(isHovered) => setHoveredButton(isHovered ? "like" : null)}
                            />
                            <LikeDislikeButton
                                action="dislike"
                                count={dislikeCount}
                                isActive={likeStatus === "dislike" || hoveredButton === "dislike"}
                                onPress={() => handleLikeDislike("dislike")}
                                onHover={(isHovered) => setHoveredButton(isHovered ? "dislike" : null)}
                            />
                        </div>
                    </div>
                </div>
                {isReplying && (
                    <div className={cn("mt-2 rounded-medium bg-content1 p-3 shadow-small relative", 
                        depth === 0 ? "pl-8" : 
                        depth === 1 ? "pl-16" : 
                        "pl-24")}>
                        <Textarea
                            fullWidth
                            placeholder="Write your reply here..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            status={validationError ? "error" : "default"}
                            errorMessage={validationError}
                            className="w-full"
                        />
                        <div className="flex justify-end mt-2 gap-2">
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
                {replies.length > 0 && (
                    <div className="nested-replies mt-2">
                        {!showReplies && (
                            <Button
                                variant="light"
                                className={cn("text-xs text-gray-500 p-0 min-w-0", 
                                    depth === 0 ? "pl-8" : 
                                    depth === 1 ? "pl-16" : 
                                    "pl-24")}
                                size="sm"
                                onPress={toggleReplies}
                            >
                                View {replies.length} more {replies.length === 1 ? "reply" : "replies"}
                            </Button>
                        )}
                        {showReplies && (
                            <>
                                {replies.map((nestedReply) => (
                                    <Reply
                                        key={nestedReply._id}
                                        reply={nestedReply}
                                        canInteract={canInteract}
                                        reviewId={reviewId}
                                        setReplies={setReplies}
                                        depth={depth + 1}
                                    />
                                ))}
                                <Button
                                    variant="light"
                                    className={cn("text-xs text-gray-500 p-0 min-w-0", 
                                        depth === 0 ? "pl-8" : 
                                        depth === 1 ? "pl-16" : 
                                        "pl-24")}
                                    size="sm"
                                    onPress={toggleReplies}
                                >
                                    Hide replies
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

export default Reply;
