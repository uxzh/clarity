import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Reply from './Reply';
import Api from '../../../lib/api';
import { IconMessages } from '@tabler/icons-react';

const api = new Api(axios);

const RepliesList = ({ reviewId, context, canInteract, replies, setReplies }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [allReplies, setAllReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);

    useEffect(() => {
        const fetchReplies = async () => {
            setLoading(true);
            try {
                const response = await api.getRepliesByReviewId({ reviewId, context });
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
                flat.push({ ...reply, replies: [] });
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
            {allReplies.length > 0 && (
                <button
                    className="flex items-center mt-2 text-primary"
                    onClick={() => setShowReplies(!showReplies)}
                >
                    <IconMessages stroke={2} />
                    <span className="ml-2">
                        {showReplies ? 'Hide Replies' : `Show ${allReplies.length} ${allReplies.length === 1 ? 'Reply' : 'Replies'}`}
                    </span>
                </button>
            )}
        </div>
    );
};

export default RepliesList;
