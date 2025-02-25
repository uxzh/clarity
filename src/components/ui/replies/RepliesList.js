import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Reply from './Reply';
import Api from '../../../lib/api';

const api = new Api(axios);

const RepliesList = ({ reviewId,context, canInteract, replies, setReplies }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReplies = async () => {
            setLoading(true);
            try {
                const response = await api.getRepliesByReviewId({ reviewId, context });
                setReplies(response.data.reverse());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReplies();
    }, [reviewId, setReplies]);

    if (loading) return <p>Loading replies...</p>;
    if (error) return <p>Error loading replies: {error}</p>;

    return (
        <div className="replies-list space-y-2 mt-2 text-default-500">
            {replies.length === 0 ? null : (
                replies.map(reply => (
                    <Reply
                        key={reply._id}
                        reply={reply}
                        canInteract={canInteract}
                        reviewId={reviewId}
                        setReplies={setReplies}
                    />
                ))
            )}
        </div>
    );
};

export default RepliesList;
