import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { getEvent, cancelEvent } from '../Components/services/EventSevice';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Groups2Icon from '@mui/icons-material/Groups2';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import 'leaflet/dist/leaflet.css';
import NumberInputDialog from '../Components/Dialogs/NumberInputDialog';
import { createTicket } from '../Components/services/EventSevice';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { getEventAnalitics } from '../Components/services/AnaliticsService';
import ReviewDialog from '../Components/Dialogs/ReviewDialog';
import Reviews from '../Components/Reviews/Reviews';

// Component to update map view
const MapViewUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center.lat !== 0 && center.lng !== 0) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [covnertedDate, setConvertedDate] = useState("");
  const [convertedTime, setConvertedTime] = useState("");
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [dates, setDates] = useState([]);
  const [values, setValues] = useState([]);
  const [timeRange, setTimeRange] = useState('weekly');
  const [userId, setUserId] = useState("");
  const [isPastEvent, setIsPastEvent] = useState(false);

  const extractUserIdFromJWT = () => {
    const token = localStorage.getItem('token'); // Assuming the JWT is stored in localStorage
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("id", decodedToken.sub.id)
      setUserId(decodedToken.sub.id);
    }
  };
  
  const openReviewDialog = () => {
    setOpenReview(true);
  }
  const closeReviewDialog = () => {
    setOpenReview(false);
  }

  const handleCancelEvent = async () => {
    try {
      await cancelEvent(id);
      window.alert("Event canceled successfully");
      window.location.reload();
    } catch (error) {
      window.alert("Failed to cancel event");
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };
  const getArcLabel = (params) => {
    const percent = params.value / (event.capacity_columns*event.capacity_rows);
    return `${(percent * 100).toFixed(0)}%`;
  };

  const handleConfirmDialog = async (quantity) => {
    try{
      await createTicket(quantity, id);
      window.alert("Ticket created successfully");
      window.location.reload();
    }catch(error){
      window.alert("Failed to create ticket");
    }
  };

  const fetchAnalitics = async (range) => {
    try {
      const response = await getEventAnalitics(range, id);
      console.log("response", response);

      // Process dates and values
      if (response.length > 0) {
        const fetchedDates = response.map(item => new Date(item.date).toLocaleDateString());
        const fetchedValues = response.map(item => item.total_quantity);
        setDates(fetchedDates);
        setValues(fetchedValues);
      }
    } catch (error) {
      console.error('Failed to fetch event analytics:', error);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEvent(id);
        setEvent(response.data.event);
        setLocation({
          lat: response.data.event.location_latitude,
          lng: response.data.event.location_longitude
        });
        convertIsoDateTime(response.data.event.begins);
        const today = new Date().toISOString();
        const eventDate = new Date(response.data.event.begins).toISOString();
        setIsPastEvent(eventDate.slice(0, 10) < today.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch event:', error);
      }
    };
    extractUserIdFromJWT();
    fetchEvent();
    if(userId === event.organizator_id){fetchAnalitics(timeRange);}
  }, [id, timeRange]);

  const convertIsoDateTime = (isoDateTime) => {
    const date = new Date(isoDateTime);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConvertedDate(formattedDate);
    setConvertedTime(time);

  };

  return (
    <Box width="100%" height="100%" sx={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
    <Box width="100%" height="100%" sx={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
      <Paper
        elevation={3}
        sx={{
          width: "40%",
          height: '70%',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
          padding: 2,
          marginRight:"20px",
           marginTop:"20px"
        }}
      >
        <Box
          component="img"
          src={"http://localhost:5005/gateway/uploads/" + event.image_path}
          alt="Event Image"
          sx={{
            width: '95%',
            height: 'auto',
            maxHeight: '300px',
            objectFit: 'cover',
            objectPosition: 'top',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        <Typography variant="h3" mt={2} textAlign={"center"} sx={{ width: '100%', px: 2, marginLeft: "25px" }}>{event.name}</Typography>
        <Typography variant="h5" mt={2}  sx={{ width: '100%', px: 2, marginLeft: "25px", fontStyle:"italic" }}>Location</Typography>
        <Typography variant="h6" mt={2} sx={{ width: '100%', px: 2, marginLeft: "25px" }}>{event.location_address}</Typography>

        <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ width: "85%", height: "320px" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={location}>
            <Popup>
              Ovde smo
            </Popup>
          </Marker>
          <MapViewUpdater center={location} />
        </MapContainer>
      </Paper>
      <Box sx={{width: "20%"}}>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: '400px',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
          padding: 2,
          marginTop:"20px"
        }}
      >
      <Box sx={{display:"flex", alignItems:"center", width:"80%"}}>
        <CalendarMonthIcon  />
        <Box sx={{displat:"flex", flexDirection:"column"}}>
        <Typography variant="h7" mt={2}  sx={{ width: '100%', px: 2}}>When</Typography>
        <Typography variant="h6" mt={2}  sx={{ width: '100%', px: 2, marginTop:"2px"}}>{covnertedDate}</Typography>
        </Box>
      </Box>
      <hr color='#d6d6d4' width="90%"></hr>
      <Box sx={{display:"flex", alignItems:"center", width:"80%"}}>
        <AccessTimeIcon  />
        <Box sx={{displat:"flex", flexDirection:"column"}}>
        <Typography variant="h8" mt={2}  sx={{ width: '100%', px: 2 }}>Time</Typography>
        <Typography variant="h6" mt={2}  sx={{ width: '100%', px: 2, marginTop:"2px"}}>{convertedTime}</Typography>
        </Box>
      </Box>
      
      <hr color='#d6d6d4' width="90%"></hr>
      <Box sx={{display:"flex", alignItems:"center", width:"80%"}}>
        <TheaterComedyIcon  />
        <Box sx={{displat:"flex", flexDirection:"column"}}>
        <Typography variant="h8" mt={2}  sx={{ width: '100%', px: 2 }}>Type of event</Typography>
        <Typography variant="h6" mt={2}  sx={{ width: '100%', px: 2, marginTop:"2px"}}>{event.event_type}</Typography>
        </Box>
      </Box>
      <hr color='#d6d6d4' width="90%"></hr>
      <Box sx={{display:"flex", alignItems:"center", width:"80%"}}>
        <AssignmentIndIcon  />
        <Box sx={{displat:"flex", flexDirection:"column"}}>
        <Typography variant="h8" mt={2}  sx={{ width: '100%', px: 2 }}>organizer</Typography>
        <Typography variant="h6" mt={2}  sx={{ width: '100%', px: 2, marginTop:"2px"}}>{event.organizator_name}</Typography>
        </Box>
      </Box>
      <hr color='#d6d6d4' width="90%"></hr>
      <Box sx={{display:"flex", alignItems:"center", width:"80%"}}>
        <Groups2Icon  />
        <Box sx={{displat:"flex", flexDirection:"column"}}>
        <Typography variant="h8" mt={2}  sx={{ width: '100%', px: 2 }}>Remaining tickers</Typography>
        {event.canceled ? <Typography variant="h6" mt={2}  sx={{ width: '100%', px: 2, marginTop:"2px", color:"red"}}>CANCELED</Typography> : (<Typography variant="h6" mt={2}  sx={{ width: '100%', px: 2, marginTop:"2px"}}>{event.capacity}</Typography>)}
        </Box>
      </Box>
      {userId === event.organizator_id ? (
        <Button variant='contained' sx={{ marginBottom: "0", marginTop: "30px" }} onClick={handleCancelEvent}>Cancel Event</Button>
      ) : (
        isPastEvent ? (
          <Button variant='contained' sx={{ marginBottom: "0", marginTop: "30px" }} onClick={openReviewDialog}>Review</Button>
        ) : (
          <Button variant='contained' sx={{ marginBottom: "0", marginTop: "30px" }} onClick={handleOpenDialog}>Buy Ticket</Button>
        )
      )}
      </Paper>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: '330px',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
          padding: 2,
          marginTop:"20px",
          overflowY:"scroll"
          }}
      >
        <Reviews eventId={id} />
      </Paper>
      </Box>
      <NumberInputDialog open={open} onClose={handleCloseDialog} onConfirm={handleConfirmDialog} />
      <ReviewDialog open={openReview} onClose={closeReviewDialog} eventId={id} />
    </Box>
    {userId === event.organizator_id && (
    <Paper
        elevation={3}
        sx={{
          width: "50%",
          height: '600px',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
          padding: 2,
          marginRight:"20px",
           marginTop:"20px"
        }}
      >
        <Box sx={{display:"flex", alignItems:"center"}}>
        <EqualizerOutlinedIcon  />
        <Typography variant="h4" mt={2} fontStyle="italic" sx={{ width: '100%', px: 2, marginTop:"2px"}}>Metrics</Typography>
        </Box>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: event.capacity_rows*event.capacity_columns-event.capacity, label: 'Sold' },
                { id: 1, value: event.capacity, label: 'Remaining' },
                
              ],
              arcLabel: getArcLabel,
              
            },
          ]}
          width={450}
          height={300}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontSize: 14,
            },
          }}
           />
          {dates.length > 0 && values.length > 0 && (
            <BarChart
              series={[
                { data: values },
              ]}
              height={250}
              xAxis={[{ data: dates, scaleType: 'band' }]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          )}
      <Typography variant="h6" mt={2} mb={2}>Select Time Range</Typography>
      <Select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        sx={{ width: "80%", marginBottom: 2 }}
      >
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
        <MenuItem value="yearly">Yearly</MenuItem>
      </Select>
      </Paper>)}
    </Box>
  );
};

export default EventPage;
