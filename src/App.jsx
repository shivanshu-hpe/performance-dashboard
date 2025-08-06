import React, { useState, useEffect } from 'react';
import './App.css';
import StorageDeviceTable from './components/StorageDeviceTable';
import SustainabilityTable from './components/SustainabilityTable';
import PerformanceTable from './components/PerformanceTable';
import FeatureTable from './components/FeatureTable';
import SystemDetailPage from './components/SystemDetailPage';
import DashboardSummary from './components/DashboardSummary';
import StorageApiService from './services/StorageApiService';
import { Refresh } from 'grommet-icons';
import { Grommet, Card, CardBody, Main } from 'grommet';

const hpeTheme = {
  global: {
    colors: {
      brand: '#01A982',
      'accent-1': '#00854C',
      background: '#f5f7fa',
      'background-back': '#ffffff',
      'background-front': '#ffffff',
      'background-contrast': '#ffffff',
      text: '#333333',
      'text-strong': '#000000',
      'text-weak': '#666666',
      'text-xweak': '#999999',
      border: '#e0e0e0',
      control: 'brand',
      'active-background': 'background-contrast',
      'active-text': 'text-strong',
      'selected-background': 'brand',
      'selected-text': 'text-strong',
      'status-critical': '#d32f2f',
      'status-error': '#d32f2f',
      'status-warning': '#ff9500',
      'status-ok': '#01A982',
      'status-unknown': '#666666',
      'status-disabled': '#cccccc',
    },
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      size: '14px',
      height: '20px',
    },
    elevation: {
      light: {
        small: '0 2px 4px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 8px rgba(0, 0, 0, 0.12)',
        large: '0 8px 16px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  card: {
    container: {
      background: 'background-back',
      elevation: 'small',
      extend: {
        borderRadius: '8px',
        overflow: 'hidden',
      },
    },
  },
};

function App() {
  // Main state for data
  const [data, setData] = useState([]);
  const [sustainabilityData, setSustainabilityData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [featureData, setFeatureData] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'deviceScore', direction: 'desc' });

  // Load all data from API or mock
  const loadAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Loading storage data...');
      
      // Load all data in parallel for better performance
      const [devices, sustainability, performance, features] = await Promise.all([
        StorageApiService.getStorageDevices(),
        StorageApiService.getSustainabilityMetrics(),
        StorageApiService.getPerformanceMetrics(),
        StorageApiService.getFeatureComparison()
      ]);

      console.log('✅ Data loaded successfully:', {
        devices: devices.length,
        sustainability: sustainability.length,
        performance: performance.length,
        features: features.length
      });

      setData(devices);
      setSustainabilityData(sustainability);
      setPerformanceData(performance);
      setFeatureData(features);

    } catch (err) {
      console.error('❌ Failed to load data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Calculate totals for the averages
  const calculateAverages = (data) => {
    if (!data || data.length === 0) return null;
    
    const totals = data.reduce((acc, device) => {
      acc.deviceScore += device.deviceScore || device.score || 0;
      acc.score += device.score || 0;
      acc.greenScore += device.greenScore || 0;
      acc.featureScore += device.featureScore || 0;
      acc.readSpeed += device.readSpeed || 0;
      acc.writeSpeed += device.writeSpeed || 0;
      acc.iops += device.iops || 0;
      acc.latency += device.latency || 0;
      acc.powerEfficiency += device.sustainability?.powerEfficiency || 0;
      acc.carbonReduction += device.sustainability?.carbonReduction || 0;
      return acc;
    }, {
      deviceScore: 0,
      score: 0,
      greenScore: 0,
      featureScore: 0,
      readSpeed: 0,
      writeSpeed: 0,
      iops: 0,
      latency: 0,
      powerEfficiency: 0,
      carbonReduction: 0
    });

    const count = data.length;
    return {
      deviceScore: Math.round(totals.deviceScore / count),
      score: Math.round(totals.score / count),
      greenScore: Math.round(totals.greenScore / count),
      featureScore: Math.round(totals.featureScore / count),
      readSpeed: Math.round(totals.readSpeed / count),
      writeSpeed: Math.round(totals.writeSpeed / count),
      iops: Math.round(totals.iops / count),
      latency: parseFloat((totals.latency / count).toFixed(2)),
      powerEfficiency: Math.round(totals.powerEfficiency / count),
      carbonReduction: Math.round(totals.carbonReduction / count)
    };
  };

  // Enriched data with device scores
  const enrichedData = data.map(device => ({
    ...device,
    deviceScore: device.deviceScore || device.score || 0
  }));

  // Calculate averages for display
  const averageData = calculateAverages(enrichedData);

  // Sorting functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort data based on current sort configuration
  const sortedData = [...enrichedData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // View details handler
  const handleViewDetails = (device) => {
    setSelectedDevice(device);
  };

  // Close details handler
  const handleCloseDetails = () => {
    setSelectedDevice(null);
  };

  // Show detailed view if device is selected
  if (selectedDevice) {
    return (
      <SystemDetailPage 
        device={selectedDevice} 
        onClose={handleCloseDetails}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <span className="hpe-text">HPE</span>
              <span className="storage-text">Storage Performance Dashboard</span>
            </div>
          </div>
        </header>
        <main className="main-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading storage data...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <span className="hpe-text">HPE</span>
              <span className="storage-text">Storage Performance Dashboard</span>
            </div>
          </div>
        </header>
        <main className="main-content">
          <div className="error-state">
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <button onClick={loadAllData} className="retry-button">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <Grommet theme={hpeTheme}>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <span className="hpe-text">HPE</span>
              <span className="storage-text">Storage Performance Dashboard</span>
            </div>
            <div className="header-controls">
              <button onClick={loadAllData} className="refresh-button" title="Refresh Data">
                <Refresh size="16px" />
              </button>
            </div>
          </div>
        </header>

        <Main className="main-content" background="background">
          <DashboardSummary devices={enrichedData} />
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium">
              <StorageDeviceTable 
                devices={sortedData}
                onSort={handleSort}
                sortConfig={sortConfig}
                onViewDetails={handleViewDetails}
                averageData={averageData}
              />
            </CardBody>
          </Card>
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium">
              <SustainabilityTable 
                devices={sustainabilityData.length > 0 ? sustainabilityData : sortedData}
                onSort={handleSort}
                sortConfig={sortConfig}
                onViewDetails={handleViewDetails}
                averageData={averageData}
              />
            </CardBody>
          </Card>
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium">
              <PerformanceTable 
                devices={performanceData.length > 0 ? performanceData : sortedData}
                onSort={handleSort}
                sortConfig={sortConfig}
                onViewDetails={handleViewDetails}
                averageData={averageData}
              />
            </CardBody>
          </Card>
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium">
              <FeatureTable 
                devices={featureData.length > 0 ? featureData : sortedData}
                onSort={handleSort}
                sortConfig={sortConfig}
                onViewDetails={handleViewDetails}
                averageData={averageData}
              />
            </CardBody>
          </Card>
        </Main>
      </div>
    </Grommet>
  );
}

export default App;
