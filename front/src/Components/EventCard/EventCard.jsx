import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Typography, Container, Paper } from '@mui/material';

const EventCard = ({ event }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`event/${event.id}`);
  };

  return (
    <Container x={{ marginTop: "10px" }} onClick={handleClick}>
      <Paper
        elevation={3}
        sx={{
          width:"400px", // Full width of the container
          height: '400px', // Fixed height
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          component="img"
          src={"http://localhost:5000/gateway/uploads/" + event.image_path}
          alt={event.name}
          sx={{
            width: '90%',
            height: '60%', // Fixed image height
            objectFit: 'cover',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        <Typography variant="h5" mt={2} textAlign="center" sx={{ width: '100%', px: 2 }}>
          {event.name}
        </Typography>
      </Paper>
    </Container>
  );
};

export default EventCard;
