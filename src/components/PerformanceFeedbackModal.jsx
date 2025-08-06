import React from 'react';
import './FeedbackModal.css';

const PerformanceFeedbackModal = ({ device, isOpen, onClose, averageData }) => {
  if (!isOpen || !device) return null;

  const generatePerformanceFeedback = (device, averageData) => {
    const suggestions = [];
    
    // Performance Score Analysis
    if (device.score < (averageData?.score || 82)) {
      suggestions.push({
        category: "Overall Performance Optimization",
        icon: "⚡",
        recommendations: [
          "Upgrade to higher performance storage tiers (Primera or Alletra series)",
          "Implement intelligent data tiering for optimal performance",
          "Enable HPE Smart Array advanced caching features",
          "Optimize workload placement based on IOPS requirements",
          "Consider NVMe storage for latency-sensitive applications"
        ]
      });
    }

    // Read Speed Analysis
    if (device.readSpeed < (averageData?.readSpeed || 2500)) {
      suggestions.push({
        category: "Read Performance Enhancement",
        icon: "📖",
        recommendations: [
          "Enable read-ahead caching for sequential workloads",
          "Implement SSD caching layers for frequently accessed data",
          "Optimize RAID configurations for read-intensive applications",
          "Consider parallel data access patterns",
          "Upgrade to higher-speed interfaces (PCIe 4.0/5.0)"
        ]
      });
    }

    // Write Speed Analysis
    if (device.writeSpeed < (averageData?.writeSpeed || 2200)) {
      suggestions.push({
        category: "Write Performance Enhancement",
        icon: "✍️",
        recommendations: [
          "Enable write-back caching with battery backup",
          "Implement write coalescing for small random writes",
          "Consider log-structured storage for write-heavy workloads",
          "Optimize journal and metadata placement",
          "Use write-optimized RAID configurations"
        ]
      });
    }

    // IOPS Analysis
    if (device.iops < (averageData?.iops || 85000)) {
      suggestions.push({
        category: "IOPS Optimization",
        icon: "🚀",
        recommendations: [
          "Implement queue depth optimization for your applications",
          "Consider NVMe storage for high IOPS requirements",
          "Enable multi-path I/O for load distribution",
          "Optimize block sizes for your specific workload patterns",
          "Use HPE's adaptive optimization features"
        ]
      });
    }

    // Latency Analysis
    if (device.latency > (averageData?.latency || 2.5)) {
      suggestions.push({
        category: "Latency Reduction",
        icon: "⏱️",
        recommendations: [
          "Move critical data to faster storage tiers",
          "Implement storage-level caching for hot data",
          "Optimize network configuration to reduce I/O path latency",
          "Consider storage class memory (SCM) for ultra-low latency",
          "Enable HPE's predictive prefetching algorithms"
        ]
      });
    }

    // Throughput Analysis
    if (device.throughput < (averageData?.throughput || 4500)) {
      suggestions.push({
        category: "Throughput Optimization",
        icon: "📊",
        recommendations: [
          "Increase connection bandwidth between hosts and storage",
          "Implement data compression to improve effective throughput",
          "Optimize stripe sizes for large sequential operations",
          "Consider storage aggregation and load balancing",
          "Enable HPE's adaptive block size optimization"
        ]
      });
    }

    // General recommendations if scores are good
    if (suggestions.length === 0) {
      suggestions.push({
        category: "Performance Excellence Opportunities",
        icon: "🏆",
        recommendations: [
          "Outstanding performance! Consider monitoring for capacity planning",
          "Explore advanced analytics with HPE InfoSight",
          "Implement automated performance tuning features",
          "Consider becoming a reference customer for performance use cases",
          "Evaluate next-generation storage technologies for future upgrades"
        ]
      });
    }

    return suggestions;
  };

  const suggestions = generatePerformanceFeedback(device, averageData);

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Performance Optimization Recommendations</h2>
          <h3>{device.name}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="device-scores">
            <div className="score-item">
              <span className="score-label">Performance Score:</span>
              <span className={`score-value ${device.score >= (averageData?.score || 82) ? 'good' : 'needs-improvement'}`}>
                {device.score}/100
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Read Speed:</span>
              <span className={`score-value ${device.readSpeed >= (averageData?.readSpeed || 2500) ? 'good' : 'needs-improvement'}`}>
                {device.readSpeed} MB/s
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Write Speed:</span>
              <span className={`score-value ${device.writeSpeed >= (averageData?.writeSpeed || 2200) ? 'good' : 'needs-improvement'}`}>
                {device.writeSpeed} MB/s
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">IOPS:</span>
              <span className={`score-value ${device.iops >= (averageData?.iops || 85000) ? 'good' : 'needs-improvement'}`}>
                {device.iops.toLocaleString()}
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Latency:</span>
              <span className={`score-value ${device.latency <= (averageData?.latency || 2.5) ? 'good' : 'needs-improvement'}`}>
                {device.latency}ms
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">Throughput:</span>
              <span className={`score-value ${device.throughput >= (averageData?.throughput || 4500) ? 'good' : 'needs-improvement'}`}>
                {device.throughput} MB/s
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
              <p><strong>Need performance tuning expertise?</strong></p>
              <p>Contact your HPE performance specialist for advanced optimization strategies and implementation guidance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceFeedbackModal;
