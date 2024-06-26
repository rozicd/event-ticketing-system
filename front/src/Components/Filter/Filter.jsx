import React from 'react';
import { Box, TextField, FormControl, InputLabel, MenuItem, Select, Typography, Paper } from '@mui/material';

const FilterComponent = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [type, setType] = React.useState('');
  const [priceOrder, setSortOrder] = React.useState('');

  return (
    <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, marginTop:"20px" }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Search by</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="category1">City</MenuItem>
            <MenuItem value="category2">Organizator</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Type"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="type1">Concert</MenuItem>
            <MenuItem value="type2">Festival</MenuItem>
            <MenuItem value="type3">Theatrical play</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            value={priceOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Price"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="pricacs">Price ascending</MenuItem>
            <MenuItem value="pricedesc">Price descending</MenuItem>
            <MenuItem value="spacedesc">Free space ascending</MenuItem>
            <MenuItem value="spacedesc">Free space descending</MenuItem>
            
          </Select>
        </FormControl>
        
      </Box>
    </Paper>
  );
};

export default FilterComponent;
