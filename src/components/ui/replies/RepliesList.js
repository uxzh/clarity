import React, { useEffect, useState } from 'react';

const RepliesList = ({ reviewId }) => {
    const [replies, setReplies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await fetch(`/api/reviews/${reviewId}/replies`);
                if (!response.ok) {
                    throw new Error('Error fetching replies');
                }
                const data = await response.json();
                setReplies(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchReplies().then(r => r);
    }, [reviewId]);

    return (
        <div>
            {error && <p>{error}</p>}
            <ul>
                {replies.map((reply) => (
                    <li key={reply._id}>{reply.content}</li>
                ))}
            </ul>
        </div>
    );
};

export default RepliesList;
