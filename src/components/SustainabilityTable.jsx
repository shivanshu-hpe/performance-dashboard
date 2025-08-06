import React from 'react';
import './ComparisonTable.css';

const SustainabilityTable = ({ devices, onSort, sortConfig, onViewDetails, averageData }) => {
  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'average';
    return 'poor';
  };

  const getComparisonLevel = (deviceValue, averageValue, isInverted = false) => {
    const threshold = averageValue * 0.05; // 5% threshold for "equal"
    
    if (isInverted) {
      if (deviceValue <= averageValue - threshold) return 'above-average';
      if (deviceValue >= averageValue + threshold) return 'below-average';
      return 'average';
    } else {
      if (deviceValue >= averageValue + threshold) return 'above-average';
      if (deviceValue <= averageValue - threshold) return 'below-average';
      return 'average';
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) return '▲▼';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="comparison-table sustainability-table">
      <div className="table-header">
        <div className="header-content">
          <div>
            <h3>🌱 Sustainability Metrics Comparison</h3>
            <p>Environmental impact and energy efficiency ratings</p>
          </div>
          <button 
            className="insights-btn"
            onClick={() => onViewInsights('sustainability')}
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
              <th 
                className={`sortable ${sortConfig?.key === 'greenScore' ? 'active' : ''}`}
                onClick={() => onSort('greenScore')}
              >
                Green Score {getSortIcon('greenScore')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'sustainability.powerEfficiency' ? 'active' : ''}`}
                onClick={() => onSort('sustainability.powerEfficiency')}
              >
                Power Efficiency {getSortIcon('sustainability.powerEfficiency')}
              </th>
              <th 
                className={`sortable ${sortConfig?.key === 'sustainability.carbonReduction' ? 'active' : ''}`}
                onClick={() => onSort('sustainability.carbonReduction')}
              >
                Carbon Reduction % {getSortIcon('sustainability.carbonReduction')}
              </th>
              <th>Deployment</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id} className="device-row">
                <td className="device-name">
                  <button 
                    className="device-name-link"
                    onClick={() => onViewDetails(device)}
                  >
                    {device.name}
                  </button>
                </td>
                <td>{device.productLine}</td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getComparisonLevel(device.greenScore, averageData?.greenScore || 78)}`}>
                      {device.greenScore}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill sustainability ${getComparisonLevel(device.greenScore, averageData?.greenScore || 78)}`}
                        style={{ width: `${device.greenScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="score-container">
                    <span className={`score ${getComparisonLevel(device.sustainability.powerEfficiency, averageData?.sustainability?.powerEfficiency || 75)}`}>
                      {device.sustainability.powerEfficiency}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill sustainability ${getComparisonLevel(device.sustainability.powerEfficiency, averageData?.sustainability?.powerEfficiency || 75)}`}
                        style={{ width: `${device.sustainability.powerEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="carbon-reduction">
                  <span className="percentage">{device.sustainability.carbonReduction}%</span>
                </td>
                <td>
                  <span className={`deployment-badge ${device.deployment.toLowerCase().replace('-', '_')}`}>
                    {device.deployment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default SustainabilityTable;
