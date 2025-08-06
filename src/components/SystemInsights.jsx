import React, { useState } from 'react';
import './SystemInsights.css';

const SystemInsights = ({ devices, selectedDevices }) => {
  const [userInputs, setUserInputs] = useState({
    utilityRate: 0.12, // $/kWh
    emissionFactor: 0.45, // kg CO2e/kWh
    region: 'US-West'
  });

  // Calculate sustainability metrics based on the reports
  const calculateSustainabilityMetrics = (device) => {
    // Simulate power consumption based on device type and performance
    let basePowerConsumption = 0;
    switch (device.type) {
      case 'NVMe SSD':
        basePowerConsumption = 8.5; // Watts
        break;
      case 'SATA SSD':
        basePowerConsumption = 3.2; // Watts
        break;
      case 'HDD':
        basePowerConsumption = 6.8; // Watts
        break;
      case 'Optane SSD':
        basePowerConsumption = 12.0; // Watts
        break;
      default:
        basePowerConsumption = 5.0;
    }

    // Adjust based on performance load (higher IOPS = more power)
    const performanceMultiplier = 1 + (device.iops / 1000000) * 0.3;
    const powerConsumption = basePowerConsumption * performanceMultiplier;

    // Calculate daily consumption in kWh
    const dailyConsumption = (powerConsumption * 24) / 1000;

    // Energy cost calculation
    const dailyEnergyCost = dailyConsumption * userInputs.utilityRate;

    // Carbon emissions calculation
    const dailyCarbonEmissions = dailyConsumption * userInputs.emissionFactor;

    return {
      powerConsumption: powerConsumption.toFixed(1),
      dailyConsumption: dailyConsumption.toFixed(2),
      dailyEnergyCost: dailyEnergyCost.toFixed(2),
      dailyCarbonEmissions: dailyCarbonEmissions.toFixed(3)
    };
  };

  // Feature classification based on device capabilities
  const getFeatureClassification = (device) => {
    const features = {
      critical: [
        { name: 'Data Reduction', present: device.score > 70, rationale: 'Cost, efficiency, capacity management' },
        { name: 'Snapshot', present: device.type.includes('SSD'), rationale: 'Backup, recovery, compliance' },
        { name: 'Replication', present: device.score > 80, rationale: 'Disaster recovery, high availability' },
        { name: 'Audit Logs', present: true, rationale: 'Security, compliance, traceability' },
        { name: 'Active Directory & LDAP', present: device.score > 75, rationale: 'Secure, scalable authentication' },
        { name: 'NFS, NFSv4, SMB Protocols', present: device.type !== 'HDD', rationale: 'OS interoperability' }
      ],
      optional: [
        { name: 'Share Settings', present: device.score > 60, rationale: 'Flexible access management, not always mandatory' },
        { name: 'Protection Policies', present: device.score > 65, rationale: 'Automation, policy-based management' }
      ]
    };

    const criticalCount = features.critical.filter(f => f.present).length;
    const optionalCount = features.optional.filter(f => f.present).length;

    return {
      features,
      criticalCount,
      optionalCount,
      totalScore: (criticalCount / features.critical.length) * 60 + (optionalCount / features.optional.length) * 40
    };
  };

  // Calculate comprehensive score based on the methodology
  const calculateComprehensiveScore = (device) => {
    const sustainability = calculateSustainabilityMetrics(device);
    const features = getFeatureClassification(device);

    // Green score (30%): Carbon (40%), Energy (30%), Cost (30%)
    const carbonScore = Math.max(0, 100 - (parseFloat(sustainability.dailyCarbonEmissions) * 100));
    const energyScore = Math.max(0, 100 - (parseFloat(sustainability.dailyConsumption) * 10));
    const costScore = Math.max(0, 100 - (parseFloat(sustainability.dailyEnergyCost) * 50));
    const greenScore = (carbonScore * 0.4 + energyScore * 0.3 + costScore * 0.3);

    // Performance score (50%): IOPS (30%), Latency (25%), Throughput (25%), Error Rate (20%)
    const iopsScore = Math.min(100, (device.iops / 1000000) * 100);
    const latencyScore = Math.max(0, 100 - (device.latency * 10));
    const throughputScore = Math.min(100, (device.readSpeed / 7000) * 100);
    const errorRateScore = 95; // Simulated low error rate
    const performanceScore = (iopsScore * 0.3 + latencyScore * 0.25 + throughputScore * 0.25 + errorRateScore * 0.2);

    // Feature score (20%): Critical (60%), Optional (40%)
    const featureScore = features.totalScore;

    // Overall score
    const overallScore = (greenScore * 0.3 + performanceScore * 0.5 + featureScore * 0.2);

    return {
      overall: overallScore.toFixed(1),
      green: greenScore.toFixed(1),
      performance: performanceScore.toFixed(1),
      feature: featureScore.toFixed(1),
      breakdown: {
        carbon: carbonScore.toFixed(1),
        energy: energyScore.toFixed(1),
        cost: costScore.toFixed(1),
        iops: iopsScore.toFixed(1),
        latency: latencyScore.toFixed(1),
        throughput: throughputScore.toFixed(1),
        errorRate: errorRateScore.toFixed(1)
      }
    };
  };

  const handleInputChange = (field, value) => {
    setUserInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  if (selectedDevices.length === 0) {
    return (
      <div className="system-insights">
        <div className="insights-header">
          <h3>System Insights & Analytics</h3>
          <p>Select storage systems to view comprehensive analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="system-insights">
      <div className="insights-header">
        <h3>System Insights & Analytics</h3>
        <p>Comprehensive analysis based on sustainability, performance, and feature metrics</p>
      </div>

      {/* User Input Section */}
      <div className="user-inputs-section">
        <h4>Configuration Parameters</h4>
        <div className="input-grid">
          <div className="input-group">
            <label>Utility Rate ($/kWh)</label>
            <input
              type="number"
              step="0.01"
              value={userInputs.utilityRate}
              onChange={(e) => handleInputChange('utilityRate', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Emission Factor (kg CO₂e/kWh)</label>
            <input
              type="number"
              step="0.01"
              value={userInputs.emissionFactor}
              onChange={(e) => handleInputChange('emissionFactor', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Region</label>
            <select value={userInputs.region} onChange={(e) => handleInputChange('region', e.target.value)}>
              <option value="US-West">US West</option>
              <option value="US-East">US East</option>
              <option value="EU">Europe</option>
              <option value="APAC">Asia Pacific</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Analysis Cards */}
      <div className="systems-grid">
        {selectedDevices.map(device => {
          const sustainability = calculateSustainabilityMetrics(device);
          const features = getFeatureClassification(device);
          const scores = calculateComprehensiveScore(device);

          return (
            <div key={device.id} className="system-card">
              <div className="system-header">
                <h4>{device.name}</h4>
                <div className="overall-score">
                  <span className="score-value">{scores.overall}</span>
                  <span className="score-label">Overall Score</span>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="score-breakdown">
                <div className="score-category">
                  <div className="category-header">
                    <span>Green (30%)</span>
                    <span className="category-score">{scores.green}</span>
                  </div>
                  <div className="sub-metrics">
                    <div className="sub-metric">
                      <span>Carbon (40%)</span>
                      <span>{scores.breakdown.carbon}</span>
                    </div>
                    <div className="sub-metric">
                      <span>Energy (30%)</span>
                      <span>{scores.breakdown.energy}</span>
                    </div>
                    <div className="sub-metric">
                      <span>Cost (30%)</span>
                      <span>{scores.breakdown.cost}</span>
                    </div>
                  </div>
                </div>

                <div className="score-category">
                  <div className="category-header">
                    <span>Performance (50%)</span>
                    <span className="category-score">{scores.performance}</span>
                  </div>
                  <div className="sub-metrics">
                    <div className="sub-metric">
                      <span>IOPS (30%)</span>
                      <span>{scores.breakdown.iops}</span>
                    </div>
                    <div className="sub-metric">
                      <span>Latency (25%)</span>
                      <span>{scores.breakdown.latency}</span>
                    </div>
                    <div className="sub-metric">
                      <span>Throughput (25%)</span>
                      <span>{scores.breakdown.throughput}</span>
                    </div>
                  </div>
                </div>

                <div className="score-category">
                  <div className="category-header">
                    <span>Features (20%)</span>
                    <span className="category-score">{scores.feature}</span>
                  </div>
                  <div className="sub-metrics">
                    <div className="sub-metric">
                      <span>Critical ({features.criticalCount}/6)</span>
                      <span>{((features.criticalCount/6)*100).toFixed(0)}</span>
                    </div>
                    <div className="sub-metric">
                      <span>Optional ({features.optionalCount}/2)</span>
                      <span>{((features.optionalCount/2)*100).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sustainability Metrics */}
              <div className="sustainability-section">
                <h5>Sustainability Metrics</h5>
                <div className="metrics-row">
                  <div className="metric">
                    <span className="metric-label">Power Consumption</span>
                    <span className="metric-value">{sustainability.powerConsumption}W</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Daily Energy Cost</span>
                    <span className="metric-value">${sustainability.dailyEnergyCost}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Daily CO₂ Emissions</span>
                    <span className="metric-value">{sustainability.dailyCarbonEmissions}kg</span>
                  </div>
                </div>
              </div>

              {/* Feature Analysis */}
              <div className="features-section">
                <h5>Feature Analysis</h5>
                <div className="features-grid">
                  <div className="feature-category">
                    <h6>Critical Features</h6>
                    {features.features.critical.map((feature, idx) => (
                      <div key={idx} className={`feature-item ${feature.present ? 'present' : 'missing'}`}>
                        <span className="feature-status">{feature.present ? '✓' : '✗'}</span>
                        <span className="feature-name">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="feature-category">
                    <h6>Optional Features</h6>
                    {features.features.optional.map((feature, idx) => (
                      <div key={idx} className={`feature-item ${feature.present ? 'present' : 'missing'}`}>
                        <span className="feature-status">{feature.present ? '✓' : '✗'}</span>
                        <span className="feature-name">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemInsights;
