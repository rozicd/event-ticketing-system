import React from 'react';
import { Box, TextField, FormControl, InputLabel, MenuItem, Select, Paper } from '@mui/material';

const FilterComponent = ({ onChange }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [type, setType] = React.useState('');
  const [priceOrder, setSortOrder] = React.useState('');

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    onChange({ searchTerm: e.target.value, category, type, priceOrder });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    onChange({ searchTerm, category: e.target.value, type, priceOrder });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    onChange({ searchTerm, category, type: e.target.value, priceOrder });
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    onChange({ searchTerm, category, type, sortOrder: e.target.value });
  };

  return (
    <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, marginTop: "20px" }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchTermChange}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Search by</InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Name">Name</MenuItem>
            <MenuItem value="Organizator">Organizator</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={handleTypeChange}
            label="Type"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Concert">Concert</MenuItem>
            <MenuItem value="Festival">Festival</MenuItem>
            <MenuItem value="Theatrical play">Theatrical play</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            value={priceOrder}
            onChange={handleSortOrderChange}
            label="Sort"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="capacity ASC">Free space ascending</MenuItem>
            <MenuItem value="capacity DESC">Free space descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default FilterComponent;
