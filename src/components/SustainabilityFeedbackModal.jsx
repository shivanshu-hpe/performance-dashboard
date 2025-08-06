import React from 'react';
import './FeedbackModal.css';

const SustainabilityFeedbackModal = ({ device, isOpen, onClose, averageData }) => {
  if (!isOpen || !device) return null;

  const generateSustainabilityFeedback = (device, averageData) => {
    const suggestions = [];
    
    // Green Score Analysis
    if (device.greenScore < (averageData?.greenScore || 78)) {
      suggestions.push({
        category: "Overall Environmental Impact",
        icon: "🌱",
        recommendations: [
          "Implement comprehensive energy management policies",
          "Consider upgrading to more energy-efficient storage solutions",
          "Establish green data center practices and monitoring",
          "Participate in renewable energy programs for your data center"
        ]
      });
    }

    // Power Efficiency Analysis
    if (device.sustainability.powerEfficiency < (averageData?.sustainability?.powerEfficiency || 75)) {
      suggestions.push({
        category: "Power Efficiency Optimization",
        icon: "⚡",
        recommendations: [
          "Enable advanced power management features on your storage systems",
          "Implement automated tiering to move inactive data to lower-power storage",
          "Consider HPE's intelligent power capping technologies",
          "Optimize cooling systems to reduce overall power consumption",
          "Use data deduplication and compression to reduce storage requirements"
        ]
      });
    }

    // Carbon Reduction Analysis
    if (device.sustainability.carbonReduction < (averageData?.sustainability?.carbonReduction || 65)) {
      suggestions.push({
        category: "Carbon Footprint Reduction",
        icon: "🌍",
        recommendations: [
          "Implement data lifecycle management to reduce unnecessary storage",
          "Consider cloud-hybrid approaches with renewable energy providers",
          "Enable thin provisioning to minimize physical storage requirements",
          "Establish carbon offset programs for your IT infrastructure",
          "Use HPE GreenLake's consumption-based model to optimize resource usage"
        ]
      });
    }

    // Circular Economy Analysis
    if (device.sustainability.circularEconomy < (averageData?.sustainability?.circularEconomy || 70)) {
      suggestions.push({
        category: "Circular Economy Practices",
        icon: "♻️",
        recommendations: [
          "Participate in HPE's equipment take-back and recycling programs",
          "Implement asset lifecycle management for responsible disposal",
          "Consider refurbished or remanufactured equipment options",
          "Establish partnerships with certified e-waste recycling providers",
          "Plan for equipment refresh cycles that maximize reuse potential"
        ]
      });
    }

    // General sustainability recommendations if scores are good
    if (suggestions.length === 0) {
      suggestions.push({
        category: "Sustainability Leadership Opportunities",
        icon: "🏆",
        recommendations: [
          "Excellent sustainability performance! Consider sharing best practices",
          "Explore opportunities to become a sustainability showcase customer",
          "Investigate advanced green technologies for future implementations",
          "Consider sustainability certifications and reporting standards",
          "Mentor other organizations in sustainable IT practices"
        ]
      });
    }

    return suggestions;
  };

  const suggestions = generateSustainabilityFeedback(device, averageData);

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Sustainability Improvement Recommendations</h2>
          <h3>{device.name}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="device-scores">
            <div className="score-item">
              <span className="score-label">Green Score:</span>
              <span className={`score-value ${device.greenScore >= (averageData?.greenScore || 78) ? 'good' : 'needs-improvement'}`}>
                {device.greenScore}/100
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Power Efficiency:</span>
              <span className={`score-value ${device.sustainability.powerEfficiency >= (averageData?.sustainability?.powerEfficiency || 75) ? 'good' : 'needs-improvement'}`}>
                {device.sustainability.powerEfficiency}/100
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Carbon Reduction:</span>
              <span className={`score-value ${device.sustainability.carbonReduction >= (averageData?.sustainability?.carbonReduction || 65) ? 'good' : 'needs-improvement'}`}>
                {device.sustainability.carbonReduction}%
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Circular Economy:</span>
              <span className={`score-value ${device.sustainability.circularEconomy >= (averageData?.sustainability?.circularEconomy || 70) ? 'good' : 'needs-improvement'}`}>
                {device.sustainability.circularEconomy}/100
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
              <p><strong>Ready to go green?</strong></p>
              <p>Contact your HPE sustainability specialist for customized environmental impact strategies and green technology implementations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityFeedbackModal;
