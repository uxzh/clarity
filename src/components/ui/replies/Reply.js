import React, {useCallback, useContext, useState} from "react";
import {Button, Textarea, User} from "@heroui/react";
import {IconMessage, IconMessageForward, IconSquareX, IconThumbDown, IconThumbUp,} from "@tabler/icons-react";
import {AuthContext} from "../../../contexts/AuthContext";
import {cn} from "./cn";

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
            {action === "like" ? <IconThumbUp stroke={2}/> : <IconThumbDown stroke={2}/>}
            <span className="ml-1">{count}</span>
        </div>
    </Button>
);

const Reply = React.memo(
    ({reply, canInteract, reviewId, setReplies, setAllReplies, allReplies, depth = 0}) => {
        const {
            user,
            _id,
            content,
            createdAt,
            likes = 0,
            dislikes = 0,
            parentReplyId,
        } = reply;

        const author = user || {};

        const {api, user: currentUser} = useContext(AuthContext);

        const [likeStatus, setLikeStatus] = useState("none");
        const [likeCount, setLikeCount] = useState(likes);
        const [dislikeCount, setDislikeCount] = useState(dislikes);
        const [hoveredButton, setHoveredButton] = useState(null);
        const [isReplying, setIsReplying] = useState(false);
        const [replyContent, setReplyContent] = useState("");
        const [cancelConfirmation, setCancelConfirmation] = useState(false);
        const [validationError, setValidationError] = useState("");

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

                if (prevLikeStatus === action) {
                    setLikeStatus("none");
                    setLikeCount((prev) => prev - (isLikeAction ? 1 : 0));
                    setDislikeCount((prev) => prev - (!isLikeAction ? 1 : 0));
                } else {
                    setLikeStatus(action);
                    setLikeCount((prev) => prev + (isLikeAction ? 1 : (prevLikeStatus === "like" ? -1 : 0)));
                    setDislikeCount((prev) => prev + (!isLikeAction ? 1 : (prevLikeStatus === "dislike" ? -1 : 0)));
                }

                try {
                    const response = await api[isLikeAction ? "likeReply" : "dislikeReply"](_id);
                    const {likes, dislikes} = response.data;

                    setReplies((prevReplies) => {
                        const updateReplies = (replies) =>
                            replies.map((r) =>
                                r._id === _id ? {...r, likes, dislikes} : {
                                    ...r,
                                    replies: updateReplies(r.replies || [])
                                }
                            );
                        return updateReplies(prevReplies);
                    });

                    setAllReplies((prevAllReplies) =>
                        prevAllReplies.map((r) =>
                            r._id === _id ? {...r, likes, dislikes} : r
                        )
                    );

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
            [canInteract, likeStatus, likeCount, dislikeCount, _id, api, setReplies, setAllReplies]
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

            const tempReply = {
                _id: `temp-${Date.now()}`,
                reviewId,
                content: replyContent.trim(),
                parentReplyId: _id,
                user: {_id: currentUser._id, username: currentUser.username, avatar: currentUser.avatar},
                createdAt: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                replies: [],
            };

            setAllReplies((prevAllReplies) => [...prevAllReplies, tempReply]);

            setReplyContent("");
            setIsReplying(false);
            setValidationError("");

            try {
                const response = await api.createReply({
                    reviewId,
                    content: replyContent.trim(),
                    parentReplyId: _id,
                });

                console.log("Nested reply response:", response.data);

                setReplies((prevReplies) => {
                    const updateReplies = (replies) =>
                        replies.map((r) => {
                            if (r._id === _id) {
                                return {...r, replies: [...(r.replies || []), response.data]};
                            }
                            return {...r, replies: updateReplies(r.replies || [])};
                        });
                    return updateReplies(prevReplies);
                });
                setAllReplies((prevAllReplies) =>
                    prevAllReplies.map((r) =>
                        r._id === tempReply._id ? {...response.data, parentReplyId: _id} : r
                    )
                );
            } catch (error) {
                console.error("Error submitting reply:", error);
                setAllReplies((prevAllReplies) =>
                    prevAllReplies.filter((r) => r._id !== tempReply._id)
                );
            }
        };

        return (
            <div className={cn("reply relative mt-2", depth === 0 ? "pl-8" : "pl-16")}>
                <div className={cn("rounded-medium bg-content1 p-4 shadow-small w-full")}>
                    <div className="flex items-start">
                        <User
                            avatarProps={{src: author?.avatar || "", size: "sm"}}
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
                                startContent={<IconMessage stroke={1.5} size={16}/>}
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
                    <div
                        className={cn("mt-2 rounded-medium bg-content1 p-3 shadow-small relative", depth === 0 ? "pl-8" : "pl-16")}>
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
            </div>
        );
    }
);

export default Reply;
