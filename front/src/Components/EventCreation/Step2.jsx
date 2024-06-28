import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function Step2({ rows, setRows, columns, setColumns, setCapacity }) {
  const handleRowsChange = (event) => {
    const newRows = parseInt(event.target.value, 10);
    setRows(newRows);
    setCapacity(newRows * columns);
  };

  const handleColumnsChange = (event) => {
    const newColumns = parseInt(event.target.value, 10);
    setColumns(newColumns);
    setCapacity(rows * newColumns);
  };

  const capacity = rows * columns;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: "550px", justifyContent:"center" }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Rows"
          type="number"
          value={rows}
          onChange={handleRowsChange}
          variant="outlined"
          fullWidth
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Columns"
          type="number"
          value={columns}
          onChange={handleColumnsChange}
          variant="outlined"
          fullWidth
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Box>
      <Box>
        <Typography variant="body1">Capacity: {capacity}</Typography>
      </Box>
    </Box>
  );
}
