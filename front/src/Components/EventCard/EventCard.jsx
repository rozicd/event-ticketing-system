import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Divider, Chip } from '@mui/material';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`event/${event.id}`);
  };

  return (
    <Container sx={{ marginTop: "10px" }} onClick={handleClick}>
      <Paper
        elevation={3}
        sx={{
          width: "400px",
          height: '450px',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 123, 255, 0.5)',
          }
        }}
      >
        <Box
          component="img"
          src={"http://localhost:5000/gateway/uploads/" + event.image_path}
          alt={event.name}
          sx={{
            marginTop: '5px',
            width: '90%',
            height: '55%',
            objectFit: 'cover',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        <Box sx={{ width: '100%', px: 2, py: 2 }}>
          <Typography variant="h5" textAlign="center">
            {event.name}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Chip
            label={event.event_type}
            color="primary"
            sx={{ marginLeft: "10px", mb: 1 }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ marginLeft:"10px", mb: 1 }}>
            {new Date(event.begins).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginLeft:"10px", mb: 1 }}>
            Remaining tickets: {event.capacity} 
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ marginLeft:"10px", mb: 1 }}>
            Organizer: {event.organizator_name}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default EventCard;
