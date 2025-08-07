import React from 'react';
import { FormUp, FormDown } from 'grommet-icons';
import './SortableHeader.css';

const SortableHeader = ({ 
  label, 
  sortKey, 
  currentSortBy, 
  currentSortOrder, 
  onSort 
}) => {
  const isActive = currentSortBy === sortKey;
  const isAsc = currentSortOrder === 'asc';
  
  const handleClick = () => {
    if (isActive) {
      // If already sorting by this column, toggle order
      onSort(sortKey, isAsc ? 'desc' : 'asc');
    } else {
      // If not sorting by this column, start with ascending
      onSort(sortKey, 'asc');
    }
  };

  return (
    <th 
      className={`sortable-header ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      <div className="header-content">
        <span>{label}</span>
        <div className="sort-icons">
          {isActive ? (
            isAsc ? (
              <FormUp size="small" color="#007bff" />
            ) : (
              <FormDown size="small" color="#007bff" />
            )
          ) : (
            <FormUp size="small" color="#ccc" />
          )}
        </div>
      </div>
    </th>
  );
};

export default SortableHeader;
