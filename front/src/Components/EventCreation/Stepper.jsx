import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { createEvent } from '../services/EventSevice';

const steps = ['Basic informations', 'Capacity', 'Location'];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [name, setName] = React.useState('');
  const [picture, setPicture] = React.useState(null);
  const [dateTime, setDateTime] = React.useState(null);
  const [type, setType] = React.useState('');
  const [convertedDateTime, setConvertedDateTime] = React.useState(null);
  const [rows, setRows] = React.useState(0);
  const [columns, setColumns] = React.useState(0);
  const [capacity, setCapacity] = React.useState(0);
  const [address, setAddress] = React.useState('');
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setName('');
    setPicture(null);
    setDateTime(null);
    setType('');
    setRows(0);
    setColumns(0);
    setCapacity(0);
    setAddress('');
    setLatitude(0);
    setLongitude(0);
  };

  const convert = (value) => {
    setDateTime(value);
    const convertedValue = new Date(value).toISOString();
    console.log(convertedValue);
    setConvertedDateTime(convertedValue);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('begins', convertedDateTime);
    formData.append('event_type', type);
    formData.append('capacity_rows', rows);
    formData.append('capacity_columns', columns);
    formData.append('capacity', capacity);
    formData.append('location_longitude', longitude);
    formData.append('location_latitude', latitude);
    formData.append('location_address', address);
    formData.append('image', picture);
    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });
    await createEvent(formData)
      .then((response) => {
        console.log('Success:', response.data);
        window.alert("Event created successfully!")
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error
      });
    
  };


  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 2 }}>
              
            </Box>
            {activeStep === 0 && (
              <Step1 name={name} setName={setName} picture={picture} setPicture={setPicture} dateTime={dateTime} setDateTime={convert} type={type} setType={setType} />
            )}
            {activeStep === 1 && (
              <Step2 rows={rows} setRows={setRows} columns={columns} setColumns={setColumns} setCapacity={setCapacity} />
            )}
            {activeStep === 2 && (
                <Step3
                  address={address}
                  setAddress={setAddress}
                  latitude={latitude}
                  setLatitude={setLatitude}
                  longitude={longitude}
                  setLongitude={setLongitude}
                />
              )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ?
            (<Button onClick={handleSubmit}>
                Finish
            </Button>):
            (<Button onClick={handleNext}>
                Next
            </Button>)
            }
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
