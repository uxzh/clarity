import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Reply from './Reply';
import Api from "../../../lib/api";


const api = new Api(axios);

const RepliesList = ({ reviewId, canInteract, replies, setReplies }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReplies = async () => {
            setLoading(true);
            try {
                const response = await api.getRepliesByReviewId({ reviewId });
                setReplies(response.data.reverse());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReplies();
    }, [reviewId, setReplies]);

    const handleAddReply = async (content, parentId = null) => {
        try {
            const response = await api.createReply({ reviewId, content });

            const newReply = {
                _id: response.data._id,
                content: response.data.content,
                user: response.data.user || { avatar: '', username: 'Anonymous' },
                createdAt: response.data.createdAt || new Date().toISOString(),
                replies: [],
            };

            if (parentId) {
                setReplies(prevReplies =>
                    prevReplies.map(reply =>
                        reply._id === parentId
                            ? { ...reply, replies: [...reply.replies, newReply] }
                            : reply
                    )
                );
            } else {
                setReplies(prevReplies => [...prevReplies, newReply]);
            }
        } catch (err) {
            console.error('Failed to add reply:', err.message);
        }
    };

    if (loading) return <p>Loading replies...</p>;
    if (error) return <p>Error loading replies: {error}</p>;

    return (
        <div className="replies-list space-y-4 p-4 mt-2 text-default-500">
            {replies.length === 0 ? (
                <p className="reply-item text-gray-500 bg-white rounded-xl p-4">No replies yet.</p>
            ) : (
                replies.map(reply => (
                    <div key={reply._id} className="reply-item bg-white rounded-xl shadow p-4">
                        <Reply reply={reply} onReplyTo={handleAddReply} canInteract={canInteract} />
                    </div>
                ))
            )}
        </div>
    );
};

export default RepliesList;
