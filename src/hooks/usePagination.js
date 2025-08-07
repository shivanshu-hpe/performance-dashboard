import { useState, useMemo, useCallback } from "react";

export const usePagination = (data, itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when data changes
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Calculate pagination values
  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page data
  const paginatedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const result = data.slice(startIndex, endIndex);

    return result;
  }, [data, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  // Go to specific page (used for search/filter reset)
  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      } else {
        setCurrentPage(1);
      }
    },
    [totalPages]
  );

  return {
    currentPage,
    totalItems,
    totalPages,
    paginatedData,
    handlePageChange,
    resetPagination,
    goToPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: Math.min(currentPage * itemsPerPage, totalItems),
  };
};

export default usePagination;
