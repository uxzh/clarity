import React from 'react';
import { User } from '@nextui-org/react';
import { formatDate } from '../../../utils/dateFormatter';
import { cn } from './cn';

const Reply = ({ reply, ...props  }) => {
    const { user: author } = reply;
    return (
        <div className={cn("reply")}>
            <div className="reply-content">
                <User
                    avatarProps={{ src: author?.avatar }}
                    name={author?.username || "Anonymous"}
                    description={formatDate(reply.createdAt)}
                    classNames={{ name: "text-small font-medium", description: "text-tiny" }}
                />
                <p className="reply-text">{reply.content}</p>
            </div>
        </div>
    );
};

export default Reply;
