import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { getTickets } from '../Components/services/EventSevice';
import { useNavigate } from 'react-router-dom';

const CustomCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 300,
  margin: 'auto',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
  transition: 'box-shadow 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0px 4px 12px rgba(0, 123, 255, 0.5)',
  },
}));

const UsersTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClick = (eventId) => {
    navigate(`/home/event/${eventId}`);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTickets();
        setTickets(response.data.events); // Remove data before events
        console.log(response.data.events)
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Grid container spacing={5} justifyContent="center" marginTop="20px">
      {tickets.map(ticket => (
        <Grid item key={ticket.id}>
          <CustomCard onClick={() => handleClick(ticket.event_id)}> {/* Corrected here */}
            <CardContent>
              <Typography variant="h6">Event ID: {ticket.event_id}</Typography>
              <Typography variant="body2">Quantity: {ticket.quantity}</Typography>
              <Typography variant="body2">User ID: {ticket.user_id}</Typography>
              <Typography variant="body2">Created At: {new Date(ticket.created_at).toLocaleString()}</Typography>
            </CardContent>
          </CustomCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default UsersTicketsPage;
