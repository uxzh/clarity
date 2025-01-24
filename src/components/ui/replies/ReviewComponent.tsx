import React, { useState, useEffect } from 'react';
import ReplyForm from './ReplyForm';
import axios from 'axios';

interface ReviewProps {
    review: {
        id: string;
        content: string;
        replies: string[];
    };
}

const ReviewComponent: React.FC<ReviewProps> = ({ review }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replies, setReplies] = useState(review.replies);

    useEffect(() => {
        const fetchReplies = async () => {
            const response = await axios.get(`/api/replies?reviewId=${review.id}`);
            setReplies(response.data);
        };
        fetchReplies();
    }, [review.id]);

    const handleReplySubmit = async (reviewId: string, reply: string) => {
        const response = await axios.post('/api/replies', { reviewId, content: reply });
        setReplies([...replies, response.data]);
        setShowReplyForm(false);
    };

    return (
        <div>
            <p>{review.content}</p>
            <button onClick={() => setShowReplyForm(!showReplyForm)}>
                {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
            {showReplyForm && (
                <ReplyForm reviewId={review.id} onReplySubmit={handleReplySubmit} />
            )}
            <div>
                {replies.map((reply, index) => (
                    <p key={index}>{reply.content}</p>
                ))}
            </div>
        </div>
    );
};

export default ReviewComponent;
