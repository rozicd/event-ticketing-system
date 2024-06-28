import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export default function Step3({ address, setAddress, latitude, setLatitude, longitude, setLongitude }) {
  const [mapCenter, setMapCenter] = useState([44.0165, 21.0059]); // Centered on Serbia

  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
        setPosition(e.latlng);
        console.log('Clicked position:', e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        getAddress(lat, lng); // Fetch the address when the map is clicked
      },
    });

    return position === null ? null : (
      <Marker position={[position.lat, position.lng]}>
        <Popup>You clicked here</Popup>
      </Marker>
    );
  }

  const getAddress = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Accept-Language': 'en', // Optional: to get the address in English
        },
      });
      if (response.data && response.data.display_name) {
        setAddress(response.data.display_name);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching the address:', error);
      setAddress('Error fetching the address');
    }
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Step 3: Location</Typography>
      </Box>
      <Box sx={{ mb: 2, width: '100%' }}>
        <MapContainer
          center={mapCenter}
          zoom={7}
          style={{ height: '450px', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
      </Box>
      <Box sx={{ mb: 2, width: '100%' }}>
        <TextField
          label="Address"
          value={address}
          onChange={handleAddressChange}
          variant="outlined"
          fullWidth
        />
      </Box>
    </Box>
  );
}
