import React, {useEffect, useState, useContext} from 'react';
import Reply from './Reply';
import {AuthContext} from '../../../contexts/AuthContext';

const RepliesList = ({reviewId, context, canInteract, replies, setReplies}) => {
    const { api } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [allReplies, setAllReplies] = useState([]);

    useEffect(() => {
        const fetchReplies = async () => {
            setLoading(true);
            try {
                const response = await api.getRepliesByReviewId({reviewId, context});
                console.log('[DEBUG_LOG] Replies API response:', response.data);
                setReplies(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReplies();
    }, [reviewId, setReplies]);

    useEffect(() => {
        if (replies.length === 0) {
            setAllReplies([]);
            return;
        }

        const flattenReplies = (repliesArray) => {
            const flat = [];
            repliesArray.forEach((reply) => {
                flat.push({...reply, replies: []});
                if (reply.replies && reply.replies.length > 0) {
                    flat.push(...flattenReplies(reply.replies));
                }
            });
            return flat;
        };
        const flattenedReplies = flattenReplies(replies).sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        console.log('[DEBUG_LOG] Updating allReplies with:', {
            total: flattenedReplies.length,
        });

        setAllReplies(flattenedReplies);
    }, [replies]);

    if (loading) return <p>Loading replies...</p>;
    if (error) return <p>Error loading replies: {error}</p>;

    return (
        <div className={`replies-list space-y-2 mt-2 text-default-500 ${allReplies.length > 0 ? 'p-4' : ''}`}>
            {allReplies.length === 0 ? null : (
                allReplies.map((reply) => (
                    <Reply
                        key={reply._id}
                        reply={reply}
                        canInteract={canInteract}
                        reviewId={reviewId}
                        setReplies={setReplies}
                        setAllReplies={setAllReplies}
                        allReplies={allReplies}
                        depth={reply.parentReplyId ? 1 : 0}
                    />
                ))
            )}
        </div>
    );
};

export default RepliesList;
