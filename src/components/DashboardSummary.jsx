import React from 'react';
import './DashboardSummary.css';
import { Storage } from 'grommet-icons';

const DashboardSummary = ({ devices = [] }) => {
  // Calculate summary statistics
  const totalSystems = devices.length;

  return (
    <div className="dashboard-summary">
      <div className="summary-header">
        <h2>Summary</h2>
      </div>
      
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon systems">
            <Storage size="20px" />
          </div>
          <div className="summary-content">
            <div className="summary-number">{totalSystems}</div>
            <div className="summary-label">Systems</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
