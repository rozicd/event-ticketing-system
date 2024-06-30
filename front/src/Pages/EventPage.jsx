import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getEvent } from '../Components/services/EventSevice';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Groups2Icon from '@mui/icons-material/Groups2';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import 'leaflet/dist/leaflet.css';

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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEvent(id);
        setEvent(response.data.event);
        setLocation({
          lat: response.data.event.location_latitude,
          lng: response.data.event.location_longitude
        });
        convertIsoDateTime(event.begins);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      }
    };
    fetchEvent();
    
  }, [id]);

  const convertIsoDateTime = (isoDateTime) => {
    const date = new Date(isoDateTime);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConvertedDate(formattedDate);
    setConvertedTime(time);

  };

  return (
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
          src={"http://localhost:5000/gateway/uploads/" + event.image_path}
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
        <Typography variant="h6" mt={2}  sx={{ width: '100%', px: 2, marginTop:"2px"}}>{event.capacity}</Typography>
        </Box>
      </Box>
      <Button variant='contained' sx={{marginBottom:"0", marginTop:"30px"}}>Buy ticket</Button>
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
          marginTop:"20px"
          }}
      >

      </Paper>
      </Box>
    </Box>
  );
};

export default EventPage;
