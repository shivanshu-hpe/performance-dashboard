import React, { useState, useEffect } from 'react';
import './ComparisonTable.css';
import PerformanceFeedbackModal from './PerformanceFeedbackModal';
import Pagination from './Pagination';
import usePagination from '../hooks/usePagination';
import { getPerformanceLevel, formatNumber } from '../utils/scoreUtils';

const PerformanceTable = ({ devices, onSort, sortConfig, onViewDetails, averageData }) => {
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
    onSort(sortKey, 'performance');
  };

  return (
    <div className="comparison-table performance-table">
      <div className="table-header">
        <div>
          <h3>Performance Metrics Comparison</h3>
          <p>Speed, capacity, and operational performance indicators</p>
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
                className={`sortable ${sortConfig?.key === 'score' ? 'active' : ''}`}
                onClick={() => handleSort('score')}
              >
                Performance Score {getSortIcon('score')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'capacity' ? 'active' : ''}`}
                onClick={() => handleSort('capacity')}
              >
                Capacity {getSortIcon('capacity')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'readSpeed' ? 'active' : ''}`}
                onClick={() => handleSort('readSpeed')}
              >
                Read Speed (MB/s) {getSortIcon('readSpeed')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'writeSpeed' ? 'active' : ''}`}
                onClick={() => handleSort('writeSpeed')}
              >
                Write Speed (MB/s) {getSortIcon('writeSpeed')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'iops' ? 'active' : ''}`}
                onClick={() => handleSort('iops')}
              >
                IOPS {getSortIcon('iops')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'latency' ? 'active' : ''}`}
                onClick={() => handleSort('latency')}
              >
                Latency (ms) {getSortIcon('latency')}
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
                    <span className={`score ${getPerformanceLevel(device.score)}`}>
                      {device.score}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill performance ${getPerformanceLevel(device.score)}`}
                        style={{ width: `${device.score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="capacity">{device.capacity}</td>
                <td className="performance-metric">{formatNumber(device.readSpeed)}</td>
                <td className="performance-metric">{formatNumber(device.writeSpeed)}</td>
                <td className="performance-metric">{formatNumber(device.iops)}</td>
                <td className="latency-metric">
                  <span className={device.latency < 0.1 ? 'low-latency' : device.latency < 0.2 ? 'medium-latency' : 'high-latency'}>
                    {device.latency}
                  </span>
                </td>
                <td>
                  <button 
                    className="feedback-button"
                    onClick={() => handleFeedbackClick(device)}
                    title="View performance optimization suggestions"
                  >
                    Optimize Performance
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
            <span className="stat-label">Average Performance Score:</span>
            <span className="stat-value">
              {Math.round(devices.reduce((sum, device) => sum + device.score, 0) / devices.length)}/100
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Fastest Read Speed:</span>
            <span className="stat-value">
              {formatNumber(devices.reduce((best, device) => 
                device.readSpeed > best.readSpeed ? device : best
              ).readSpeed)} MB/s
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Lowest Latency:</span>
            <span className="stat-value">
              {devices.reduce((best, device) => 
                device.latency < best.latency ? device : best
              ).latency} ms
            </span>
          </div>
        </div>
      </div>
      
      <PerformanceFeedbackModal 
        device={selectedDevice}
        isOpen={isModalOpen}
        onClose={closeModal}
        averageData={averageData}
      />
    </div>
  );
};

export default PerformanceTable;
