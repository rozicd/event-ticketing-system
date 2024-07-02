import React, { useEffect, useState } from 'react';
import EventCard from '../Components/EventCard/EventCard';
import { getPaginatedEvents } from '../Components/services/EventSevice';
import { Box, Grid, Pagination } from '@mui/material';
import Filter from '../Components/Filter/Filter';
function Home() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
  
    const [filters, setFilters] = useState({
      searchTerm: '',
      category: '',
      type: '',
      sortOrder: '',
    });
  
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await getPaginatedEvents(page, 4,filters.searchTerm, filters.category, filters.type, filters.sortOrder);
          setEvents(response.items);
          setTotalPages(response.total_pages);
          console.log('Events:', response);
        } catch (error) {
          console.error('Failed to fetch events:', error);
        }
      };
  
      fetchEvents();
    }, [page, filters]);
  
    const handleChange = (event, value) => {
        setPage(value);
    }

    const handleFilterChange = (newFilters) => {
      setFilters(newFilters);
      setPage(1); // Reset page to 1 when filters change
    };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
        <Filter onChange={handleFilterChange}/>
      <Pagination count={totalPages} onChange={handleChange} sx={{ margin: "20px" }} />
      <Box p={2} width="100%" maxWidth="1200px" sx={{marginLeft:"130px", display: "flex", justifyContent: "center" }}>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center"> 
          {events.map((event) => (
            <Grid item key={event.id} xs={6} >
              <EventCard
                event={event}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
