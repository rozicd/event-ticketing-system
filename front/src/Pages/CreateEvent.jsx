import React from 'react';
import HorizontalLinearStepper from '../Components/EventCreation/Stepper';
import { Box } from '@mui/material';


const CreateEvent = () => {


  return (
  <Box sx={{width:"100%", display:"flex", alignItems:"center", justifyContent:"center", marginTop:"100px"}}>
   <Box sx={{width:"70%"}}>
    <HorizontalLinearStepper/>
   </Box>
   </Box>
  );
};

export default CreateEvent;
