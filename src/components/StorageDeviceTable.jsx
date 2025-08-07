import React, { useState, useEffect } from 'react';
import './StorageDeviceTable.css';
import FeedbackModal from './FeedbackModal';
import Pagination from './Pagination';
import usePagination from '../hooks/usePagination';
import { StatusGood } from 'grommet-icons';
import { getPerformanceLevel, formatNumber } from '../utils/scoreUtils';

const StorageDeviceTable = ({ devices, onViewDetails, averageData }) => {
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

  // Reset pagination when devices array length changes (indicating new data)
  useEffect(() => {
    resetPagination();
  }, [devices?.length, resetPagination]);

  const handleFeedbackClick = (device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  return (
    <div className="storage-device-table">
      <div className="table-header">
        <div>
          <h3>HPE Storage Product Overview</h3>
          <p>Comprehensive comparison of all HPE storage solutions with key scores</p>
        </div>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Storage Tier</th>
              <th>Device Score</th>
              <th>Performance Score</th>
              <th>Green Score</th>
              <th>Feature Score</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((device) => {
              return (
              <tr 
                key={device.id} 
                className="device-row"
              >
                <td className="device-name">
                  <button 
                    className="device-name-link"
                    onClick={() => onViewDetails(device)}
                    title="Click to view detailed analysis"
                  >
                    {device.name}
                  </button>
                </td>
                <td>
                  <span className={`device-type ${device.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    {device.type}
                  </span>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getPerformanceLevel(device.deviceScore)}`}>
                      {device.deviceScore}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${getPerformanceLevel(device.deviceScore)}`}
                        style={{ width: `${device.deviceScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getPerformanceLevel(device.score)}`}>
                      {device.score}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${getPerformanceLevel(device.score)}`}
                        style={{ width: `${device.score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getPerformanceLevel(device.greenScore)}`}>
                      {device.greenScore}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${getPerformanceLevel(device.greenScore)}`}
                        style={{ width: `${device.greenScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getPerformanceLevel(device.featureScore)}`}>
                      {device.featureScore}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${getPerformanceLevel(device.featureScore)}`}
                        style={{ width: `${device.featureScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <button 
                    className="feedback-button"
                    onClick={() => handleFeedbackClick(device)}
                    title="View improvement suggestions"
                  >
                    Get Suggestions
                  </button>
                </td>
              </tr>
              );
            })}
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
            <span className="stat-label">Total Products:</span>
            <span className="stat-value">{devices.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Highest Performance Score:</span>
            <span className="stat-value">
              {devices.reduce((best, device) => 
                device.score > best.score ? device : best
              ).score}/100
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Highest Device Score:</span>
            <span className="stat-value">
              {devices.reduce((best, device) => 
                device.deviceScore > best.deviceScore ? device : best
              ).deviceScore}/100
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Highest Green Score:</span>
            <span className="stat-value">
              {devices.reduce((best, device) => 
                device.greenScore > best.greenScore ? device : best
              ).greenScore}/100
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Highest Feature Score:</span>
            <span className="stat-value">
              {devices.reduce((best, device) => 
                device.featureScore > best.featureScore ? device : best
              ).featureScore}/100
            </span>
          </div>
        </div>
      </div>
      
      <FeedbackModal 
        device={selectedDevice}
        isOpen={isModalOpen}
        onClose={closeModal}
        averageData={averageData}
      />
    </div>
  );
};

export default StorageDeviceTable;
