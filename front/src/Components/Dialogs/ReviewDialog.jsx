import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import { createReview } from '../services/ReviewService';

const ReviewDialog = ({ open, onClose, eventId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleConfirm = async () => {
    const reviewData = {
      rating: rating,
      comment: comment,
      event_id: eventId,
    };
    // Perform any action with reviewData, like submitting to backend
    console.log('Review Data:', reviewData);
    try{
        const response = await createReview(reviewData);
        window.alert('Review created successfully');
        window.location.reload();
    }catch(error){
        console.error('Failed to create review:', error);
        window.alert('Failed to create review');
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Leave a review</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Rating
            name="event-rating"
            defaultValue={0.0} 
            precision={0.5}
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </Box>
        <TextField
          label="Comment"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;
