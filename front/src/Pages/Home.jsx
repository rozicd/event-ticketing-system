import React, { useEffect, useState } from 'react';
import EventCard from '../Components/EventCard/EventCard';
import { getPaginatedEvents } from '../Components/services/EventSevice';
import { Box, Grid, Pagination } from '@mui/material';
import Filter from '../Components/Filter/Filter';

function Home() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await getPaginatedEvents(page);
          setEvents(response.items);
          setTotalPages(response.total_pages);
          console.log('Events:', response);
        } catch (error) {
          console.error('Failed to fetch events:', error);
        }
      };
  
      fetchEvents();
    }, [page]);
  
    const handleChange = (event, value) => {
        setPage(value);
    }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
        <Filter />
      <Pagination count={totalPages} onChange={handleChange} sx={{ margin: "20px" }} />
      <Box p={2} width="100%" maxWidth="1200px">
        <Grid container spacing={6} justifyContent="center">
          {events.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4} lg={4}>
              <EventCard
                pictureUrl={event.image_path} // Replace with actual picture URL logic
                eventName={event.name}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
