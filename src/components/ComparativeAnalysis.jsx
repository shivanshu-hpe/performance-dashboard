import React from 'react';
import './ComparativeAnalysis.css';

const ComparativeAnalysis = ({ selectedDevices }) => {
  if (selectedDevices.length < 2) {
    return (
      <div className="comparative-analysis">
        <div className="analysis-header">
          <h3>Comparative Analysis</h3>
          <p>Select at least 2 systems to view comparative insights</p>
        </div>
      </div>
    );
  }

  // Calculate sustainability comparison
  const getSustainabilityComparison = () => {
    return selectedDevices.map(device => {
      let basePower = 0;
      switch (device.type) {
        case 'NVMe SSD': basePower = 8.5; break;
        case 'SATA SSD': basePower = 3.2; break;
        case 'HDD': basePower = 6.8; break;
        case 'Optane SSD': basePower = 12.0; break;
        default: basePower = 5.0;
      }
      
      const powerConsumption = basePower * (1 + (device.iops / 1000000) * 0.3);
      const dailyConsumption = (powerConsumption * 24) / 1000;
      const monthlyCost = dailyConsumption * 30 * 0.12;
      const monthlyEmissions = dailyConsumption * 30 * 0.45;
      
      return {
        name: device.name,
        power: powerConsumption.toFixed(1),
        cost: monthlyCost.toFixed(2),
        emissions: monthlyEmissions.toFixed(1)
      };
    });
  };

  // Performance comparison
  const getPerformanceComparison = () => {
    const maxValues = {
      readSpeed: Math.max(...selectedDevices.map(d => d.readSpeed)),
      writeSpeed: Math.max(...selectedDevices.map(d => d.writeSpeed)),
      iops: Math.max(...selectedDevices.map(d => d.iops)),
      score: Math.max(...selectedDevices.map(d => d.score))
    };

    return selectedDevices.map(device => ({
      name: device.name,
      readSpeedPercent: (device.readSpeed / maxValues.readSpeed * 100).toFixed(0),
      writeSpeedPercent: (device.writeSpeed / maxValues.writeSpeed * 100).toFixed(0),
      iopsPercent: (device.iops / maxValues.iops * 100).toFixed(0),
      scorePercent: (device.score / maxValues.score * 100).toFixed(0),
      readSpeed: device.readSpeed,
      writeSpeed: device.writeSpeed,
      iops: device.iops,
      score: device.score
    }));
  };

  // Feature comparison
  const getFeatureComparison = () => {
    const allFeatures = [
      'Data Reduction', 'Snapshot', 'Replication', 'Audit Logs',
      'Active Directory & LDAP', 'NFS/SMB Protocols', 'Share Settings', 'Protection Policies'
    ];

    return selectedDevices.map(device => {
      const criticalFeatures = [
        device.score > 70,  // Data Reduction
        device.type.includes('SSD'),  // Snapshot
        device.score > 80,  // Replication
        true,  // Audit Logs
        device.score > 75,  // Active Directory
        device.type !== 'HDD',  // NFS/SMB
        device.score > 60,  // Share Settings
        device.score > 65   // Protection Policies
      ];

      return {
        name: device.name,
        features: criticalFeatures,
        featureCount: criticalFeatures.filter(Boolean).length
      };
    });
  };

  const sustainabilityData = getSustainabilityComparison();
  const performanceData = getPerformanceComparison();
  const featureData = getFeatureComparison();

  // Find best performers
  const bestPerformers = {
    greenest: sustainabilityData.reduce((best, current) => 
      parseFloat(current.emissions) < parseFloat(best.emissions) ? current : best
    ),
    fastest: performanceData.reduce((best, current) => 
      current.score > best.score ? current : best
    ),
    mostFeatures: featureData.reduce((best, current) => 
      current.featureCount > best.featureCount ? current : best
    ),
    mostCostEffective: selectedDevices.reduce((best, current) => 
      (current.score / current.price) > (best.score / best.price) ? current : best
    )
  };

  return (
    <div className="comparative-analysis">
      <div className="analysis-header">
        <h3>Comparative Analysis</h3>
        <p>Side-by-side comparison of {selectedDevices.length} selected systems</p>
      </div>

      {/* Best Performers Summary */}
      <div className="best-performers">
        <h4>Best Performers</h4>
        <div className="performers-grid">
          <div className="performer-card green">
            <div className="performer-icon">🌱</div>
            <div className="performer-info">
              <span className="performer-title">Greenest</span>
              <span className="performer-name">{bestPerformers.greenest.name.split(' ').slice(0, 2).join(' ')}</span>
              <span className="performer-metric">{bestPerformers.greenest.emissions}kg CO₂/month</span>
            </div>
          </div>
          <div className="performer-card performance">
            <div className="performer-icon">⚡</div>
            <div className="performer-info">
              <span className="performer-title">Fastest</span>
              <span className="performer-name">{bestPerformers.fastest.name.split(' ').slice(0, 2).join(' ')}</span>
              <span className="performer-metric">{bestPerformers.fastest.score} score</span>
            </div>
          </div>
          <div className="performer-card features">
            <div className="performer-icon">🔧</div>
            <div className="performer-info">
              <span className="performer-title">Most Features</span>
              <span className="performer-name">{bestPerformers.mostFeatures.name.split(' ').slice(0, 2).join(' ')}</span>
              <span className="performer-metric">{bestPerformers.mostFeatures.featureCount}/8 features</span>
            </div>
          </div>
          <div className="performer-card value">
            <div className="performer-icon">💰</div>
            <div className="performer-info">
              <span className="performer-title">Best Value</span>
              <span className="performer-name">{bestPerformers.mostCostEffective.name.split(' ').slice(0, 2).join(' ')}</span>
              <span className="performer-metric">{(bestPerformers.mostCostEffective.score / bestPerformers.mostCostEffective.price).toFixed(1)} score/$</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparisons */}
      <div className="comparison-sections">
        {/* Sustainability Comparison */}
        <div className="comparison-section">
          <h4>Sustainability Impact</h4>
          <div className="comparison-table">
            <div className="table-header">
              <span>System</span>
              <span>Power (W)</span>
              <span>Monthly Cost</span>
              <span>Monthly CO₂</span>
            </div>
            {sustainabilityData.map((item, index) => (
              <div key={index} className="table-row">
                <span className="system-name">{item.name.split(' ').slice(0, 2).join(' ')}</span>
                <span>{item.power}W</span>
                <span>${item.cost}</span>
                <span>{item.emissions}kg</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="comparison-section">
          <h4>Performance Metrics</h4>
          <div className="performance-bars">
            {performanceData.map((item, index) => (
              <div key={index} className="performance-item">
                <div className="system-label">{item.name.split(' ').slice(0, 2).join(' ')}</div>
                <div className="metrics-bars">
                  <div className="metric-bar">
                    <span className="metric-label">Read: {item.readSpeed} MB/s</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: `${item.readSpeedPercent}%`, backgroundColor: '#4ECDC4' }}></div>
                    </div>
                  </div>
                  <div className="metric-bar">
                    <span className="metric-label">Write: {item.writeSpeed} MB/s</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: `${item.writeSpeedPercent}%`, backgroundColor: '#45B7AA' }}></div>
                    </div>
                  </div>
                  <div className="metric-bar">
                    <span className="metric-label">Score: {item.score}</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: `${item.scorePercent}%`, backgroundColor: '#3DA58A' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="comparison-section">
          <h4>Feature Availability</h4>
          <div className="feature-matrix">
            <div className="matrix-header">
              <span>Feature</span>
              {featureData.map((device, index) => (
                <span key={index}>{device.name.split(' ').slice(0, 2).join(' ')}</span>
              ))}
            </div>
            {['Data Reduction', 'Snapshot', 'Replication', 'Audit Logs', 'Active Directory', 'NFS/SMB', 'Share Settings', 'Protection Policies'].map((feature, featureIndex) => (
              <div key={featureIndex} className="matrix-row">
                <span className="feature-name">{feature}</span>
                {featureData.map((device, deviceIndex) => (
                  <span key={deviceIndex} className={`feature-status ${device.features[featureIndex] ? 'available' : 'unavailable'}`}>
                    {device.features[featureIndex] ? '✓' : '✗'}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeAnalysis;
