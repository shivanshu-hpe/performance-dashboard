import React from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ device, isOpen, onClose, averageData }) => {
  if (!isOpen || !device) return null;

  const generateSuggestions = (device, averageData) => {
    const suggestions = [];
    
    // Device Score Analysis
    if (device.deviceScore < (averageData?.deviceScore || 85)) {
      suggestions.push({
        category: "Overall Device Performance",
        icon: "📊",
        recommendations: [
          "Consider upgrading to a higher-tier storage solution",
          "Optimize storage configuration for better performance",
          "Review current workload requirements and match with appropriate device tier"
        ]
      });
    }

    // Performance Score Analysis
    if (device.score < (averageData?.score || 82)) {
      suggestions.push({
        category: "Performance Score",
        icon: "⚡",
        recommendations: [
          "Implement HPE performance optimization best practices",
          "Enable HPE Smart Array features for better throughput",
          "Consider HPE Primera or Alletra series for higher performance",
          "Optimize data placement and tiering strategies"
        ]
      });
    }

    // Green Score Analysis
    if (device.greenScore < (averageData?.greenScore || 78)) {
      suggestions.push({
        category: "Environmental Efficiency",
        icon: "🌱",
        recommendations: [
          "Enable power management features",
          "Implement data deduplication to reduce storage footprint",
          "Consider HPE GreenLake consumption-based model",
          "Optimize cooling and power consumption settings"
        ]
      });
    }

    // Feature Score Analysis
    if (device.featureScore < (averageData?.featureScore || 80)) {
      suggestions.push({
        category: "Feature Utilization",
        icon: "🔧",
        recommendations: [
          "Enable advanced HPE storage features like snapshots and replication",
          "Implement automated data tiering",
          "Utilize HPE InfoSight for predictive analytics",
          "Consider upgrading to enterprise features for better functionality"
        ]
      });
    }

    // General recommendations if scores are good
    if (suggestions.length === 0) {
      suggestions.push({
        category: "Optimization Opportunities",
        icon: "🎯",
        recommendations: [
          "Your device is performing well! Consider monitoring trends for future planning",
          "Explore HPE GreenLake for operational efficiency",
          "Implement regular performance monitoring and maintenance",
          "Consider capacity planning for future growth"
        ]
      });
    }

    return suggestions;
  };

  const suggestions = generateSuggestions(device, averageData);

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Performance Improvement Suggestions</h2>
          <h3>{device.name}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="device-scores">
            <div className="score-item">
              <span className="score-label">Device Score:</span>
              <span className={`score-value ${device.deviceScore >= (averageData?.deviceScore || 85) ? 'good' : 'needs-improvement'}`}>
                {device.deviceScore}/100
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Performance Score:</span>
              <span className={`score-value ${device.score >= (averageData?.score || 82) ? 'good' : 'needs-improvement'}`}>
                {device.score}/100
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Green Score:</span>
              <span className={`score-value ${device.greenScore >= (averageData?.greenScore || 78) ? 'good' : 'needs-improvement'}`}>
                {device.greenScore}/100
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Feature Score:</span>
              <span className={`score-value ${device.featureScore >= (averageData?.featureScore || 80) ? 'good' : 'needs-improvement'}`}>
                {device.featureScore}/100
              </span>
            </div>
          </div>

          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-section">
                <h4 className="suggestion-title">
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  {suggestion.category}
                </h4>
                <ul className="recommendation-list">
                  {suggestion.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="recommendation-item">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <div className="hpe-contact">
              <p><strong>Need expert guidance?</strong></p>
              <p>Contact your HPE representative for personalized optimization strategies and implementation support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
