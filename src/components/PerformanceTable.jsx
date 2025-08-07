import React, { useState, useEffect } from 'react';
import './ComparisonTable.css';
import PerformanceFeedbackModal from './PerformanceFeedbackModal';
import Pagination from './Pagination';
import usePagination from '../hooks/usePagination';
import { getPerformanceLevel } from '../utils/scoreUtils';
import SortableHeader from './SortableHeader';

// Local formatNumber function to avoid import issues
const formatNumber = (num) => {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const PerformanceTable = ({ devices, onViewDetails, averageData, sortBy, sortOrder, onSort }) => {
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
              <th>Product Name</th>
              <SortableHeader 
                label="Performance Score" 
                sortKey="score" 
                currentSortBy={sortBy} 
                currentSortOrder={sortOrder} 
                onSort={onSort} 
              />
              <th>Capacity</th>
              <th>Read Latency (ms)</th>
              <th>Write Latency (ms)</th>
              <th>IOPS</th>
              <th>Throughput (MB/s)</th>
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
                <td className="capacity">
                  <div className="capacity-display">
                    {device.usedCapacityTB && device.totalCapacityTB ? (
                      <>
                        <span className="capacity-text">
                          {device.usedCapacityTB}TB / {device.totalCapacityTB}TB
                        </span>
                        <div className="capacity-bar">
                          <div 
                            className="capacity-fill"
                            style={{ 
                              width: `${(device.usedCapacityTB / device.totalCapacityTB) * 100}%`,
                              backgroundColor: device.usedCapacityTB / device.totalCapacityTB > 0.8 ? '#F44336' : 
                                             device.usedCapacityTB / device.totalCapacityTB > 0.6 ? '#FF9800' : '#01A982'
                            }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      <span className="capacity-text">{device.capacity}</span>
                    )}
                  </div>
                </td>
                <td className="latency-metric">
                  <span className={device.readLatency < 1 ? 'low-latency' : device.readLatency < 3 ? 'medium-latency' : 'high-latency'}>
                    {device.readLatency || device.latency}
                  </span>
                </td>
                <td className="latency-metric">
                  <span className={(device.writeLatency || (device.latency * 1.1)) < 2 ? 'low-latency' : (device.writeLatency || (device.latency * 1.1)) < 5 ? 'medium-latency' : 'high-latency'}>
                    {device.writeLatency || (device.latency * 1.1).toFixed(3)}
                  </span>
                </td>
                <td className="performance-metric">{formatNumber(device.iops)}</td>
                <td className="performance-metric">
                  <div className="throughput-display">
                    <div className="throughput-combined">
                      <span className="read-speed">R: {formatNumber(device.readSpeed || 0)}</span>
                      <span className="write-speed">W: {formatNumber(device.writeSpeed || 0)}</span>
                    </div>
                    <div className="throughput-average">
                      Avg: {formatNumber(Math.round(((device.readSpeed || 0) + (device.writeSpeed || 0)) / 2))}
                    </div>
                  </div>
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
            <span className="stat-label">Fastest Throughput:</span>
            <span className="stat-value">
              {formatNumber(devices.reduce((best, device) => {
                const bestAvg = ((best.readSpeed || 0) + (best.writeSpeed || 0)) / 2;
                const deviceAvg = ((device.readSpeed || 0) + (device.writeSpeed || 0)) / 2;
                return deviceAvg > bestAvg ? device : best;
              }, devices[0] || {}).readSpeed || 0)} MB/s
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
