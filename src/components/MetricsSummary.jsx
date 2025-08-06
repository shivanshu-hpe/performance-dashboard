import React from 'react';
import './MetricsSummary.css';
import CapacityMeter from './CapacityMeter';

const MetricsSummary = ({ devices, selectedDevices }) => {
  const calculateMetrics = () => {
    if (selectedDevices.length === 0) return null;
    
    const avgScore = selectedDevices.reduce((sum, device) => sum + device.score, 0) / selectedDevices.length;
    const maxReadSpeed = Math.max(...selectedDevices.map(d => d.readSpeed));
    const avgPrice = selectedDevices.reduce((sum, device) => sum + device.price, 0) / selectedDevices.length;
    const bestValue = selectedDevices.reduce((best, device) => {
      const currentValue = device.score / device.price;
      const bestValue = best.score / best.price;
      return currentValue > bestValue ? device : best;
    });

    // Calculate capacity utilization (simulated based on performance)
    const avgCapacityUtil = selectedDevices.reduce((sum, device) => {
      // Simulate capacity utilization based on performance score
      let utilization = 100 - device.score; // Higher score = lower utilization
      if (utilization < 20) utilization = Math.random() * 30 + 20; // Min 20%
      if (utilization > 95) utilization = 95; // Max 95%
      return sum + utilization;
    }, 0) / selectedDevices.length;

    return {
      avgScore: avgScore.toFixed(1),
      maxReadSpeed: maxReadSpeed.toLocaleString(),
      avgPrice: avgPrice.toFixed(0),
      bestValue: bestValue.name.split(' ').slice(0, 2).join(' '),
      capacityUtilization: Math.round(avgCapacityUtil)
    };
  };

  const getUtilizationStatus = (utilization) => {
    if (utilization >= 95) return { status: 'critical', color: '#DC2626', bgColor: '#FEF2F2' };
    if (utilization >= 80) return { status: 'warning', color: '#D97706', bgColor: '#FFFBEB' };
    if (utilization >= 60) return { status: 'moderate', color: '#0891B2', bgColor: '#F0F9FF' };
    return { status: 'good', color: '#059669', bgColor: '#F0FDF4' };
  };

  const metrics = calculateMetrics();

  if (!metrics) {
    return (
      <div className="metrics-summary">
        <div className="summary-header">
          <h3>Performance Insights</h3>
          <p>Select storage devices to view performance metrics</p>
        </div>
      </div>
    );
  }

  const utilizationStatus = getUtilizationStatus(metrics.capacityUtilization);

  return (
    <div className="metrics-summary">
      <div className="summary-header">
        <h3>HPE Storage Performance Insights</h3>
        <p>Analysis of {selectedDevices.length} selected HPE storage product{selectedDevices.length > 1 ? 's' : ''}</p>
      </div>
      
      {/* Capacity Utilization Meters */}
      <div className="capacity-meters-section">
        <CapacityMeter 
          percentage={metrics.capacityUtilization} 
          label="Storage Capacity Utilization"
          usedCapacity={metrics.capacityUtilization}
          totalCapacity={100}
        />
        
        {/* Additional utilization examples based on performance */}
        {selectedDevices.length > 0 && (
          <CapacityMeter 
            percentage={selectedDevices.length > 1 ? 95 : 80} 
            label="Performance Load Distribution"
            usedCapacity={selectedDevices.length > 1 ? 95 : 80}
            totalCapacity={100}
          />
        )}
      </div>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">Average Score</div>
          <div className="metric-value">{metrics.avgScore}</div>
          <div className="metric-unit">Points</div>
          <div className="metric-chart">
            <div className="mini-bar">
              <div 
                className="mini-bar-fill" 
                style={{ width: `${metrics.avgScore}%`, backgroundColor: '#4ECDC4' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Max Read Speed</div>
          <div className="metric-value">{metrics.maxReadSpeed}</div>
          <div className="metric-unit">MB/s</div>
          <div className="metric-chart">
            <div className="mini-bar">
              <div 
                className="mini-bar-fill" 
                style={{ width: `${Math.min(100, (parseInt(metrics.maxReadSpeed.replace(',', '')) / 7000) * 100)}%`, backgroundColor: '#45B7AA' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Average Price</div>
          <div className="metric-value">{metrics.avgPrice}</div>
          <div className="metric-unit">USD</div>
          <div className="metric-chart">
            <div className="mini-bar">
              <div 
                className="mini-bar-fill" 
                style={{ width: `${Math.min(100, (metrics.avgPrice / 300) * 100)}%`, backgroundColor: '#3DA58A' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Best Value HPE Product</div>
          <div className="metric-value">{metrics.bestValue}</div>
          <div className="metric-unit">Product</div>
          <div className="metric-chart">
            <div className="value-indicator">
              <span className="value-badge">★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsSummary;
