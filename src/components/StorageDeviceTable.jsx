import React from 'react';
import './StorageDeviceTable.css';

const StorageDeviceTable = ({ devices, onSort, sortConfig, onViewDetails, averageData }) => {
  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'average';
    return 'poor';
  };

  const getComparisonLevel = (deviceValue, averageValue, isInverted = false) => {
    const threshold = averageValue * 0.05; // 5% threshold for "equal"
    
    if (isInverted) {
      // For metrics like latency where lower is better
      if (deviceValue <= averageValue - threshold) return 'above-average';
      if (deviceValue >= averageValue + threshold) return 'below-average';
      return 'average';
    } else {
      // For metrics where higher is better
      if (deviceValue >= averageValue + threshold) return 'above-average';
      if (deviceValue <= averageValue - threshold) return 'below-average';
      return 'average';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return '▲▼';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="storage-device-table">
      <div className="table-header">
        <div className="header-content">
          <div>
            <h3>📊 HPE Storage Product Overview</h3>
            <p>Comprehensive comparison of all HPE storage solutions with key scores</p>
          </div>
          <button 
            className="insights-btn"
            onClick={() => onViewInsights('overview')}
          >
            📈 View Insights
          </button>
        </div>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Line</th>
              <th>Tier</th>
              <th>Type</th>
              <th 
                className={`sortable ${sortConfig?.key === 'deviceScore' ? 'active' : ''}`}
                onClick={() => onSort('deviceScore')}
              >
                Device Score {getSortIcon('deviceScore')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'score' ? 'active' : ''}`}
                onClick={() => onSort('score')}
              >
                HPE Performance Score {getSortIcon('score')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'greenScore' ? 'active' : ''}`}
                onClick={() => onSort('greenScore')}
              >
                Green Score {getSortIcon('greenScore')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'featureScore' ? 'active' : ''}`}
                onClick={() => onSort('featureScore')}
              >
                Feature Score {getSortIcon('featureScore')}
              </th>
              <th>Deployment</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => {
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
                <td>{device.productLine}</td>
                <td>{device.tier}</td>
                <td>
                  <span className={`device-type ${device.type.toLowerCase().replace(' ', '-')}`}>
                    {device.type}
                  </span>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getComparisonLevel(device.deviceScore, averageData?.deviceScore || 85)}`}>
                      {device.deviceScore}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${getComparisonLevel(device.deviceScore, averageData?.deviceScore || 85)}`}
                        style={{ width: `${device.deviceScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getComparisonLevel(device.score, averageData?.score || 82)}`}>
                      {device.score}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${getComparisonLevel(device.score, averageData?.score || 82)}`}
                        style={{ width: `${device.score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getComparisonLevel(device.greenScore, averageData?.greenScore || 78)}`}>
                      {device.greenScore}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${getComparisonLevel(device.greenScore, averageData?.greenScore || 78)}`}
                        style={{ width: `${device.greenScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getComparisonLevel(device.featureScore, averageData?.featureScore || 80)}`}>
                      {device.featureScore}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${getComparisonLevel(device.featureScore, averageData?.featureScore || 80)}`}
                        style={{ width: `${device.featureScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>{device.deployment}</td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="table-summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Total Products:</span>
            <span className="stat-value">{devices.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Highest HPE Performance Score:</span>
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
    </div>
  );
};

export default StorageDeviceTable;
