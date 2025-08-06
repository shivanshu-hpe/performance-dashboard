import React from 'react';
import './CapacityMeter.css';

const CapacityMeter = ({ percentage, label, usedCapacity = null, totalCapacity = null }) => {
  const getUtilizationStatus = (utilization) => {
    if (utilization >= 95) return { status: 'critical', color: '#DC2626' };
    if (utilization >= 80) return { status: 'warning', color: '#D97706' };
    if (utilization >= 60) return { status: 'moderate', color: '#0891B2' };
    return { status: 'good', color: '#059669' };
  };

  const status = getUtilizationStatus(percentage);

  return (
    <div className="capacity-meter">
      <div className="capacity-header">
        <h4>{label}</h4>
      </div>
      
      <div className="capacity-display">
        <div className="percentage-display">
          <span className="percentage-number">{percentage}%</span>
        </div>
        
        <div className="capacity-info">
          {usedCapacity && totalCapacity ? (
            <span className="capacity-text">{usedCapacity}TiB of {totalCapacity}TiB</span>
          ) : (
            <span className="capacity-text">Utilization Level</span>
          )}
          
          <div className="progress-container">
            <div className="progress-background"></div>
            <div 
              className={`progress-fill ${status.status}`}
              style={{ 
                width: `${percentage}%`,
                backgroundColor: status.color 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacityMeter;
