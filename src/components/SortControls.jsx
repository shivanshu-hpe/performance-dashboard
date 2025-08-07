import React from 'react';
import { Box, Select, Button } from 'grommet';
import { FormUp, FormDown } from 'grommet-icons';
import './SortControls.css';

const SortControls = ({ 
  currentSortBy = 'deviceScore', 
  currentSortOrder = 'asc', 
  onSortChange,
  availableFields = [
    { value: 'deviceScore', label: 'Device Score' },
    { value: 'score', label: 'Performance Score' },
    { value: 'greenScore', label: 'Green Score' },
    { value: 'featureScore', label: 'Feature Score' }
  ]
}) => {
  
  const handleSortFieldChange = (event) => {
    const newSortBy = event.option;
    onSortChange(newSortBy, currentSortOrder);
  };

  const handleSortOrderToggle = () => {
    const newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(currentSortBy, newSortOrder);
  };

  return (
    <Box direction="row" align="center" gap="small" className="sort-controls">
      <Box>
        <label htmlFor="sort-field" style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Sort by:
        </label>
      </Box>
      
      <Box width="medium">
        <Select
          id="sort-field"
          options={availableFields}
          value={currentSortBy}
          onChange={handleSortFieldChange}
          labelKey="label"
          valueKey="value"
          size="small"
          placeholder="Select field"
        />
      </Box>
      
      <Button
        icon={currentSortOrder === 'asc' ? <FormUp /> : <FormDown />}
        onClick={handleSortOrderToggle}
        tip={`Currently sorting ${currentSortOrder === 'asc' ? 'ascending' : 'descending'}. Click to toggle.`}
        size="small"
        plain
        className="sort-order-button"
      />
      
      <Box>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {currentSortOrder === 'asc' ? 'Low to High' : 'High to Low'}
        </span>
      </Box>
    </Box>
  );
};

export default SortControls;
