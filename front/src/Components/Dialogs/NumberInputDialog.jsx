import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const NumberInputDialog = ({ open, onClose, onConfirm }) => {
  const [value, setValue] = useState(1);

  const handleIncrease = () => {
    setValue(prevValue => prevValue + 1);
  };

  const handleDecrease = () => {
    setValue(prevValue => (prevValue > 1 ? prevValue - 1 : 1));
  };

  const handleConfirm = () => {
    onConfirm(value);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter a Number</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          <IconButton onClick={handleDecrease}>
            <RemoveIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mx: 2 }}>
            {value}
          </Typography>
          <IconButton onClick={handleIncrease}>
            <AddIcon />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NumberInputDialog;
