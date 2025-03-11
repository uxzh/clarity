// New Reply component (can be in the same file or separate)
import {Button, User} from "@heroui/react";
import React, {useState} from "react";
import {formatDate} from "../../../utils/dateFormatter";
import {cn} from "../../FEEDBACK/cn";

const Reply = React.forwardRef(({ reply, depth = 0, onReplyTo, canInteract }, ref) => {
    const [isReplying, setIsReplying] = useState(false);
    const maxDepth = 3; // Maximum nesting level

    return (
        <div ref={ref} className={cn(
            "pl-4 border-l-2 border-default-200 mt-2",
            depth > 0 && "ml-4"
        )}>
            <div className="rounded-medium bg-content2 p-3 shadow-small">
                <User
                    avatarProps={{ src: reply.user?.avatar }}
                    name={reply.user?.username || "Anonymous"}
                    description={formatDate(reply.createdAt)}
                    classNames={{ name: "text-small font-medium", description: "text-tiny" }}
                />
                <p className="mt-2 text-small text-default-600">{reply.content}</p>

                {depth < maxDepth && (
                    <div className="mt-2 flex gap-2">
                        {canInteract && (
                            <Button
                                size="sm"
                                variant="light"
                                className="text-tiny"
                                startContent={<IconMessage size={16} />}
                                onPress={() => setIsReplying(true)}
                            >
                                Reply
                            </Button>
                        )}
                    </div>
                )}

                {isReplying && (
                    <div className="mt-2">
                        <Textarea
                            size="sm"
                            placeholder="Write your reply..."
                            className="mb-2"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() => setIsReplying(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                color="primary"
                                onPress={() => {
                                    onReplyTo(reply._id);
                                    setIsReplying(false);
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Render nested replies */}
            {reply.replies?.map((nestedReply) => (
                <Reply
                    key={nestedReply._id}
                    reply={nestedReply}
                    depth={depth + 1}
                    onReplyTo={onReplyTo}
                    canInteract={canInteract}
                />
            ))}
        </div>
    );
});

Reply.displayName = "Reply";
