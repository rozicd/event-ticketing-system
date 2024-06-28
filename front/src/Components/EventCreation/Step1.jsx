import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { DateTimePicker } from '@mui/x-date-pickers';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const Step1 = ({ name, setName, picture, setPicture, dateTime, setDateTime, type, setType }) => {
  const onDrop = React.useCallback((acceptedFiles) => {
    // Handle file drop
    if (acceptedFiles.length) {
      setPicture(acceptedFiles[0]);
    }
  }, [setPicture]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column', gap: 2, padding: "40px", justifyContent: "center", alignItems: "center" }}>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ width: "50%" }}
      />
      
      <FormControl sx={{ width: "50%" }}>
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          id="type-select"
          value={type}
          label="Type"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="Concert">Concert</MenuItem>
          <MenuItem value="Festival">Festival</MenuItem>
          <MenuItem value="Theatrical play">Theatrical play</MenuItem>
        </Select>
      </FormControl>
      <DateTimePicker
        label="When"
        value={dateTime}
        onChange={(newValue) => setDateTime(newValue)}
        sx={{ width: "50%" }}
      />
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed gray',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          height: '400px',
          width: '50%'
        }}
      >
        <input {...getInputProps()} />
        {picture ? (
          <Box>
            <Typography variant="body1">{picture.name}</Typography>
            <img src={URL.createObjectURL(picture)} alt="Preview" style={{ maxWidth: '100%', maxHeight: "380px", marginTop: '10px' }} />
          </Box>
        ) : (
          <Typography variant="body1">Drag 'n' drop a picture here, or click to select one</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Step1;
