import React, { useState, useEffect } from 'react';
import './ComparisonTable.css';
import SustainabilityFeedbackModal from './SustainabilityFeedbackModal';
import Pagination from './Pagination';
import usePagination from '../hooks/usePagination';
import { getPerformanceLevel } from '../utils/scoreUtils';

const SustainabilityTable = ({ devices, onSort, sortConfig, onViewDetails, averageData }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination hook
  const {
    currentPage,
    totalItems,
    paginatedData,
    handlePageChange,
    resetPagination
  } = usePagination(devices, 5);

  // Reset pagination when devices change
  useEffect(() => {
    resetPagination();
  }, [devices, resetPagination]);

  const handleFeedbackClick = (device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return '▲▼';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const handleSort = (sortKey) => {
    onSort(sortKey, 'sustainability');
  };

  return (
    <div className="comparison-table sustainability-table">
      <div className="table-header">
        <div>
          <h3>Sustainability Metrics Comparison</h3>
          <p>Environmental impact and energy efficiency ratings</p>
        </div>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th 
                className={`sortable ${sortConfig?.key === 'name' ? 'active' : ''}`}
                onClick={() => handleSort('name')}
              >
                Product Name {getSortIcon('name')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'greenScore' ? 'active' : ''}`}
                onClick={() => handleSort('greenScore')}
              >
                Green Score {getSortIcon('greenScore')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'sustainability.powerEfficiency' ? 'active' : ''}`}
                onClick={() => handleSort('sustainability.powerEfficiency')}
              >
                Power Efficiency {getSortIcon('sustainability.powerEfficiency')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'sustainability.carbonReduction' ? 'active' : ''}`}
                onClick={() => handleSort('sustainability.carbonReduction')}
              >
                Carbon Reduction % {getSortIcon('sustainability.carbonReduction')}
              </th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((device) => (
              <tr key={device.id} className="device-row">
                <td className="device-name">
                  <button 
                    className="device-name-link"
                    onClick={() => onViewDetails(device)}
                  >
                    {device.name}
                  </button>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getPerformanceLevel(device.greenScore)}`}>
                      {device.greenScore}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill sustainability ${getPerformanceLevel(device.greenScore)}`}
                        style={{ width: `${device.greenScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getPerformanceLevel(device.sustainability.powerEfficiency)}`}>
                      {device.sustainability.powerEfficiency}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill sustainability ${getPerformanceLevel(device.sustainability.powerEfficiency)}`}
                        style={{ width: `${device.sustainability.powerEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="carbon-reduction">
                  <span className="percentage">{device.sustainability.carbonReduction}%</span>
                </td>
                <td>
                  <button 
                    className="feedback-button"
                    onClick={() => handleFeedbackClick(device)}
                    title="View sustainability improvement suggestions"
                  >
                    Get Green Tips
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={5}
          onPageChange={handlePageChange}
        />
      </div>
      
      <div className="table-summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Average Green Score:</span>
            <span className="stat-value">
              {Math.round(devices.reduce((sum, device) => sum + device.greenScore, 0) / devices.length)}/100
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Best Power Efficiency:</span>
            <span className="stat-value">
              {devices.reduce((best, device) => 
                device.sustainability.powerEfficiency > best.sustainability.powerEfficiency ? device : best
              ).sustainability.powerEfficiency}/100
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Max Carbon Reduction:</span>
            <span className="stat-value">
              {devices.reduce((best, device) => 
                device.sustainability.carbonReduction > best.sustainability.carbonReduction ? device : best
              ).sustainability.carbonReduction}%
            </span>
          </div>
        </div>
      </div>
      
      <SustainabilityFeedbackModal 
        device={selectedDevice}
        isOpen={isModalOpen}
        onClose={closeModal}
        averageData={averageData}
      />
    </div>
  );
};

export default SustainabilityTable;
