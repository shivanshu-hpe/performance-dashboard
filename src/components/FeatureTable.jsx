import React, { useState, useEffect } from 'react';
import './ComparisonTable.css';
import FeatureFeedbackModal from './FeatureFeedbackModal';
import Pagination from './Pagination';
import usePagination from '../hooks/usePagination';
import { getPerformanceLevel } from '../utils/scoreUtils';

const FeatureTable = ({ devices, onSort, sortConfig, onViewDetails, averageData }) => {
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
    onSort(sortKey, 'feature');
  };

  const formatProtocols = (protocols) => {
    return protocols.join(', ');
  };

  return (
    <div className="comparison-table feature-table">
      <div className="table-header">
        <div>
          <h3>Feature Metrics Comparison</h3>
          <p>Advanced capabilities and supported features</p>
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
                className={`sortable ${sortConfig?.key === 'featureScore' ? 'active' : ''}`}
                onClick={() => handleSort('featureScore')}
              >
                Feature Score {getSortIcon('featureScore')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'dataReduction' ? 'active' : ''}`}
                onClick={() => handleSort('dataReduction')}
              >
                Data Reduction {getSortIcon('dataReduction')}
              </th>
              <th>Snapshots</th>
              <th>Replication</th>
              <th>Protocols</th>
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
                    <span className={`score ${getPerformanceLevel(device.featureScore)}`}>
                      {device.featureScore}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill feature ${getPerformanceLevel(device.featureScore)}`}
                        style={{ width: `${device.featureScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="data-reduction-badge">
                    {device.dataReduction}
                  </span>
                </td>
                <td>
                  <span className={`feature-badge ${device.snapshots === 'Yes' ? 'available' : 'unavailable'}`}>
                    {device.snapshots}
                  </span>
                </td>
                <td>
                  <span className={`feature-badge ${device.replication === 'Yes' ? 'available' : device.replication === 'Optional' ? 'optional' : 'unavailable'}`}>
                    {device.replication}
                  </span>
                </td>
                <td className="protocols">
                  <div className="protocol-list">
                    {device.protocols && Array.isArray(device.protocols) ? 
                      device.protocols.map((protocol, index) => (
                        <span key={index} className="protocol-tag">
                          {protocol}
                        </span>
                      )) : 
                      <span className="protocol-tag">N/A</span>
                    }
                  </div>
                </td>
                <td>
                  <button 
                    className="feedback-button"
                    onClick={() => handleFeedbackClick(device)}
                    title="View feature enhancement suggestions"
                  >
                    Enhance Features
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
            <span className="stat-label">Average Feature Score:</span>
            <span className="stat-value">
              {Math.round(devices.reduce((sum, device) => sum + device.featureScore, 0) / devices.length)}/100
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Best Data Reduction:</span>
            <span className="stat-value">
              {devices.filter(device => device.dataReduction && device.dataReduction.includes(':')).length > 0 
                ? devices
                    .filter(device => device.dataReduction && device.dataReduction.includes(':'))
                    .reduce((best, device) => {
                      const currentRatio = parseInt(device.dataReduction.split(':')[0]);
                      const bestRatio = parseInt(best.dataReduction.split(':')[0]);
                      return currentRatio > bestRatio ? device : best;
                    }).dataReduction
                : 'N/A'
              }
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Most Protocols:</span>
            <span className="stat-value">
              {devices.filter(device => device.protocols && Array.isArray(device.protocols)).length > 0
                ? devices
                    .filter(device => device.protocols && Array.isArray(device.protocols))
                    .reduce((best, device) => 
                      device.protocols.length > best.protocols.length ? device : best
                    ).protocols.length
                : 0
              }
            </span>
          </div>
        </div>
      </div>
      
      <FeatureFeedbackModal 
        device={selectedDevice}
        isOpen={isModalOpen}
        onClose={closeModal}
        averageData={averageData}
      />
    </div>
  );
};

export default FeatureTable;
