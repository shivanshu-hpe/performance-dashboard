import React from 'react';
import './Pagination.css';
import { Previous, Next } from 'grommet-icons';

const Pagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage = 10, 
  onPageChange,
  disabled = false 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (!disabled && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currentPage <= 3) {
        // Show first pages
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>
          Showing {startItem}-{endItem} of {totalItems} entries
        </span>
      </div>
      
      <div className="pagination-controls">
        <button
          className={`pagination-btn ${currentPage === 1 || disabled ? 'disabled' : ''}`}
          onClick={handlePrevious}
          disabled={currentPage === 1 || disabled}
          title="Previous page"
        >
          <Previous size="16px" />
          Previous
        </button>

        <div className="pagination-pages">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`pagination-page ${page === currentPage ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => handlePageClick(page)}
                disabled={disabled}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          className={`pagination-btn ${currentPage === totalPages || disabled ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={currentPage === totalPages || disabled}
          title="Next page"
        >
          Next
          <Next size="16px" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
