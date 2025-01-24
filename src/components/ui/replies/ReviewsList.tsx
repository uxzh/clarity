import React, { useEffect, useState } from 'react';
import ReviewComponent from './ReviewComponent';
import axios from 'axios';

const ReviewsList: React.FC = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const response = await axios.get('/api/reviews');
            setReviews(response.data);
        };
        fetchReviews();
    }, []);

    return (
        <div>
            {reviews.map((review) => (
                <ReviewComponent key={review.id} review={review} />
            ))}
        </div>
    );
};

export default ReviewsList;
