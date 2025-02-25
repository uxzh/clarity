import React, { useState, useCallback, useContext } from 'react';
import { User, Button, Textarea } from '@nextui-org/react';
import { IconMessage, IconThumbUp, IconThumbDown, IconSquareX, IconMessageForward } from "@tabler/icons-react";
import { AuthContext } from "../../../contexts/AuthContext";
import { cn } from './cn';

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
            isActive ? (action === "like" ? "text-primary" : "text-danger") : "text-default-400"
        )}
    >
        <div className="flex items-center">
            {action === "like" ? <IconThumbUp stroke={2} /> : <IconThumbDown stroke={2} />}
            <span className="ml-1">{count}</span>
        </div>
    </Button>
);

const Reply = React.memo(({ reply, canInteract, reviewId, setReplies, depth = 0 }) => {
    const { user: author = {}, _id, content, createdAt, likes = 0, dislikes = 0, replies = [], parentReplyId } = reply;
    const { api, user } = useContext(AuthContext);

    const [likeStatus, setLikeStatus] = useState("none");
    const [likeCount, setLikeCount] = useState(likes);
    const [dislikeCount, setDislikeCount] = useState(dislikes);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [cancelConfirmation, setCancelConfirmation] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [showReplies, setShowReplies] = useState(false); // Folded by default

    const simplifiedDateFormat = (dateString) => {
        if (!dateString) return "Unknown Date";
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "Invalid Date"
            : new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
    };

    const handleLikeDislike = useCallback(async (action) => {
        if (!canInteract) {
            console.log("You need to be logged in with a verified email to interact.");
            return;
        }

        const prevLikeStatus = likeStatus;
        const prevLikeCount = likeCount;
        const prevDislikeCount = dislikeCount;

        // Optimistic UI update
        setLikeStatus((prev) => (prev === action ? "none" : action));
        setLikeCount((prev) => (prevLikeStatus === "like" && action !== "like" ? prev - 1 : action === "like" ? prev + 1 : prev));
        setDislikeCount((prev) => (prevLikeStatus === "dislike" && action !== "dislike" ? prev - 1 : action === "dislike" ? prev + 1 : prev));

        try {
            console.log(`Attempting to ${action} reply at depth ${depth}:`, _id);
            const response = await api[action === "like" ? "likeReply" : "dislikeReply"](_id);
            console.log(`${action} response at depth ${depth}:`, response.data);
            const { likes, dislikes } = response.data;

            // Update the parent state immutably with detailed logging
            setReplies((prevReplies) => {
                console.log("Updating replies state for:", _id);
                const updateNestedReplies = (repliesArray) => {
                    return repliesArray.map(r => {
                        if (r._id === _id) {
                            console.log(`Found reply ${_id} at depth ${depth}, updating likes: ${likes}, dislikes: ${dislikes}`);
                            return { ...r, likes, dislikes };
                        }
                        if (r.replies && r.replies.length > 0) {
                            return { ...r, replies: updateNestedReplies(r.replies) };
                        }
                        return r;
                    });
                };
                const updatedReplies = updateNestedReplies(prevReplies);
                console.log("Updated replies state:", updatedReplies);
                return updatedReplies;
            });
        } catch (error) {
            console.error(`Error ${action}ing reply at depth ${depth}:`, error);
            setLikeStatus(prevLikeStatus);
            setLikeCount(prevLikeCount);
            setDislikeCount(prevDislikeCount);
        }
    }, [canInteract, likeStatus, likeCount, dislikeCount, _id, api, setReplies, depth]);

    const handleReply = useCallback(() => {
        if (!canInteract) {
            console.log("You need to be logged in with a verified email to reply.");
            return;
        }
        setIsReplying(true);
        setReplyContent(`@${user.username || "Anonymous"} `);
    }, [canInteract, user.username]);

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
            console.log("Submitting reply:", { reviewId, content: replyContent.trim(), parentReplyId: _id });
            const response = await api.createReply({ reviewId, content: replyContent.trim(), parentReplyId: parentReplyId || _id });
            console.log("Reply response:", response.data);
            setReplies(prevReplies => {
                return prevReplies.map(r => {
                    if (r._id === (parentReplyId || _id) || r.replies.some(subReply => subReply._id === (parentReplyId || _id))) {
                        return { ...r, replies: [...r.replies, response.data] };
                    }
                    return r;
                });
            });
            setReplyContent("");
            setIsReplying(false);
            setValidationError("");
            setShowReplies(true);
            if (!parentReplyId) setShowReplies(true);
        } catch (error) {
            console.error("Error submitting reply:", error);
        }
    };

    const toggleReplies = () => {
        setShowReplies(prev => !prev);
    };

    return (
        <div className={cn("reply relative mt-2", parentReplyId ? "pl-8" : "pl-2")}>
            <div className={cn("rounded-medium bg-content1 p-4 shadow-small w-full")}>
                <div className="flex items-start">
                    <User
                        avatarProps={{ src: user.avatar || '', size: "sm" }}
                        name={user.username || "Anonymous"}
                        description={simplifiedDateFormat(createdAt)}
                        classNames={{ name: "text-sm font-medium", description: "text-xs text-gray-500" }}
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
                <div className={cn("mt-2 rounded-medium bg-content1 p-3 shadow-small relative pl-8")}>
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
            {replies.length > 0 && !parentReplyId && (
                <div className="nested-replies mt-2">
                    {!showReplies && (
                        <Button
                            variant="light"
                            className="text-xs text-gray-500 p-0 min-w-0 pl-8"
                            size="sm"
                            onPress={toggleReplies}
                        >
                            View {replies.length} more {replies.length === 1 ? "reply" : "replies"}
                        </Button>
                    )}
                    {showReplies && (
                        <>
                            {replies.map(nestedReply => (
                                <Reply
                                    key={nestedReply._id}
                                    reply={nestedReply}
                                    canInteract={canInteract}
                                    reviewId={reviewId}
                                    setReplies={setReplies}
                                />
                            ))}
                            <Button
                                variant="light"
                                className="text-xs text-gray-500 p-0 min-w-0 pl-8"
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
});

export default Reply;
