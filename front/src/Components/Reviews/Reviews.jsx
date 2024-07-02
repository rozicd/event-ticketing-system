import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Rating from '@mui/material/Rating';
import { getEventReviews } from '../services/ReviewService';

const Reviews = ({ eventId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await getEventReviews(eventId);
                if (response.status === 'success') {
                    setReviews(response.data.reviews);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [eventId]);

    return (
        <Box>
            {reviews.map((review) => (
                <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <PersonIcon />
                        <Rating
                            name="read-only"
                            value={review.rating}
                            readOnly
                            precision={0.5}
                            sx={{ ml: 1 }}
                        />
                    </Box>
                    <Typography variant="body2">{review.comment}</Typography>
                </Paper>
            ))}
        </Box>
    );
};

export default Reviews;
