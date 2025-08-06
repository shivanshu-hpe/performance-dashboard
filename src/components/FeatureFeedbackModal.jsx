import React from 'react';
import './FeedbackModal.css';

const FeatureFeedbackModal = ({ device, isOpen, onClose, averageData }) => {
  if (!isOpen || !device) return null;

  const generateFeatureFeedback = (device, averageData) => {
    const suggestions = [];
    
    // Feature Score Analysis
    if (device.featureScore < (averageData?.featureScore || 80)) {
      suggestions.push({
        category: "Overall Feature Enhancement",
        icon: "🔧",
        recommendations: [
          "Enable advanced HPE storage features like InfoSight analytics",
          "Implement automated data management and tiering",
          "Activate built-in security and compliance features",
          "Explore enterprise-grade replication and backup capabilities",
          "Consider upgrading to feature-rich storage tiers"
        ]
      });
    }

    // Data Management Analysis
    if (device.features.dataManagement.deduplication !== "Advanced" || 
        device.features.dataManagement.compression !== "Advanced") {
      suggestions.push({
        category: "Data Management Optimization",
        icon: "💾",
        recommendations: [
          "Enable advanced deduplication to reduce storage footprint",
          "Implement inline compression for better capacity utilization",
          "Set up automated tiering for optimal data placement",
          "Configure thin provisioning to maximize efficiency",
          "Enable real-time analytics for data insights"
        ]
      });
    }

    // Security Features Analysis
    if (device.features.security.encryption !== "AES-256" || 
        !device.features.security.accessControl.includes("RBAC")) {
      suggestions.push({
        category: "Security Enhancement",
        icon: "🔒",
        recommendations: [
          "Enable AES-256 encryption for data at rest and in transit",
          "Implement Role-Based Access Control (RBAC) for user management",
          "Set up multi-factor authentication for administrative access",
          "Enable audit logging and compliance reporting",
          "Configure secure key management systems"
        ]
      });
    }

    // Availability Features Analysis
    if (!device.features.availability.includes("Auto-failover") || 
        !device.features.availability.includes("Hot-spare")) {
      suggestions.push({
        category: "High Availability Setup",
        icon: "🛡️",
        recommendations: [
          "Configure automatic failover for business continuity",
          "Set up hot-spare drives for immediate recovery",
          "Implement RAID configurations for data protection",
          "Enable continuous data replication for disaster recovery",
          "Set up monitoring and alerting for proactive maintenance"
        ]
      });
    }

    // Management Features Analysis
    if (!device.features.management.includes("REST API") || 
        !device.features.management.includes("Cloud Integration")) {
      suggestions.push({
        category: "Management and Integration",
        icon: "⚙️",
        recommendations: [
          "Enable REST API access for automation and integration",
          "Set up cloud integration for hybrid management",
          "Implement centralized monitoring and reporting",
          "Configure automated provisioning and scaling",
          "Use infrastructure-as-code for consistent deployments"
        ]
      });
    }

    // Protocol Support Analysis
    const hasModernProtocols = device.features.protocols.some(p => 
      ["NVMe-oF", "iSCSI", "FC", "Ethernet"].includes(p)
    );
    if (!hasModernProtocols) {
      suggestions.push({
        category: "Protocol Modernization",
        icon: "🌐",
        recommendations: [
          "Upgrade to modern protocols like NVMe over Fabrics",
          "Implement multi-protocol support for flexibility",
          "Consider Ethernet-based storage networking",
          "Enable protocol optimization for specific workloads",
          "Plan for future protocol migrations"
        ]
      });
    }

    // General recommendations if scores are good
    if (suggestions.length === 0) {
      suggestions.push({
        category: "Feature Excellence Opportunities",
        icon: "🌟",
        recommendations: [
          "Excellent feature utilization! Consider advanced use cases",
          "Explore next-generation features like AI-driven optimization",
          "Implement advanced analytics and machine learning capabilities",
          "Consider becoming a reference customer for innovative features",
          "Evaluate emerging technologies for competitive advantage"
        ]
      });
    }

    return suggestions;
  };

  const suggestions = generateFeatureFeedback(device, averageData);

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Feature Enhancement Recommendations</h2>
          <h3>{device.name}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="device-scores">
            <div className="score-item">
              <span className="score-label">Feature Score:</span>
              <span className={`score-value ${device.featureScore >= (averageData?.featureScore || 80) ? 'good' : 'needs-improvement'}`}>
                {device.featureScore}/100
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Deduplication:</span>
              <span className={`score-value ${device.features.dataManagement.deduplication === "Advanced" ? 'good' : 'needs-improvement'}`}>
                {device.features.dataManagement.deduplication}
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Compression:</span>
              <span className={`score-value ${device.features.dataManagement.compression === "Advanced" ? 'good' : 'needs-improvement'}`}>
                {device.features.dataManagement.compression}
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Encryption:</span>
              <span className={`score-value ${device.features.security.encryption === "AES-256" ? 'good' : 'needs-improvement'}`}>
                {device.features.security.encryption}
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Protocols:</span>
              <span className="score-value good">
                {device.features.protocols.join(', ')}
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
              <p><strong>Want to unlock more features?</strong></p>
              <p>Contact your HPE solutions architect for advanced feature implementations and custom configurations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureFeedbackModal;
