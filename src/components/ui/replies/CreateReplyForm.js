import React, { useState } from 'react';

const CreateReplyForm = ({ reviewId, onReplyCreated }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('/api/replies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewId, content }),
            });

            if (!response.ok) {
                throw new Error('Error creating reply');
            }

            const reply = await response.json();
            onReplyCreated(reply);
            setContent('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
      <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reply..."
          required
      />
            <button type="submit">Submit Reply</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default CreateReplyForm;
