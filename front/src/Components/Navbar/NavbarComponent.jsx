import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';



export default function Navbar() {
    const navigate = useNavigate();


    const handleLoginClick = () => {
        navigate('/login');
    };
    

  return (
    <Box sx={{  display: "flex", justifyContent:"space-between" }}>
      <AppBar position="static" >
        <Toolbar sx={{  display: "flex", justifyContent:"space-between" }}>
            
        <Typography variant="h6" component="div" sx={{ marginRight:"15px"  }}>
            News
        </Typography>
        <Box sx={{display:"flex", flexDirection:"row" }}>
            <Button  color="inherit" sx={{margin: "3px"}}>Events</Button>
            <Button color="inherit" sx={{margin: "3px"}}>Past</Button>
            <Button color="inherit" sx={{margin: "3px"}}>My events</Button>
        </Box>
          <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
