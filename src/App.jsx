import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import './App.css';

// Components
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

// Dashboard Component
function Dashboard() {
  const navigate = useNavigate();
  
  // Main state for data
  const [data, setData] = useState([]);
  const [sustainabilityData, setSustainabilityData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [featureData, setFeatureData] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Auto-polling state
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sorting state - separate for each table
  const [sortConfigs, setSortConfigs] = useState({
    main: { key: 'deviceScore', direction: 'desc' },
    sustainability: { key: 'greenScore', direction: 'desc' },
    performance: { key: 'score', direction: 'desc' },
    feature: { key: 'featureScore', direction: 'asc' }
  });

  // Load all data from API or mock with sorting
  const loadAllData = async (sortKey = null, sortDirection = null, tableType = null, isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setLoading(true);
    } else {
      setIsRefreshing(true); // Show spinner for auto-refresh
    }
    setError(null);

    try {
      console.log('🔄 Loading storage data...');
      
      // Use current sort configs if no specific sort params provided
      const mainSort = sortKey && tableType === 'main' ? 
        { key: sortKey, direction: sortDirection } : sortConfigs.main;
      const sustainabilitySort = sortKey && tableType === 'sustainability' ? 
        { key: sortKey, direction: sortDirection } : sortConfigs.sustainability;
      const performanceSort = sortKey && tableType === 'performance' ? 
        { key: sortKey, direction: sortDirection } : sortConfigs.performance;
      const featureSort = sortKey && tableType === 'feature' ? 
        { key: sortKey, direction: sortDirection } : sortConfigs.feature;
      
      // Load all data in parallel for better performance with sorting
      const [devices, sustainability, performance, features] = await Promise.all([
        StorageApiService.getStorageDevices(mainSort.key, mainSort.direction),
        StorageApiService.getSustainabilityMetrics(sustainabilitySort.key, sustainabilitySort.direction),
        StorageApiService.getPerformanceMetrics(performanceSort.key, performanceSort.direction),
        StorageApiService.getFeatureComparison(featureSort.key, featureSort.direction)
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
      setLastUpdated(new Date());

    } catch (err) {
      console.error('❌ Failed to load data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false); // Clear refresh spinner
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Auto-polling every 30 seconds
  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-polling data refresh...');
      loadAllData(null, null, null, true); // isAutoRefresh = true to avoid loading state
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isPolling, sortConfigs]); // Re-run if polling state or sort configs change

  // Handle manual refresh
  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    loadAllData();
  };

  // Format last updated time for tooltip
  const getLastUpdatedText = () => {
    if (!lastUpdated) return 'Never updated';
    
    // Format the time in user's local timezone
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    const timeString = lastUpdated.toLocaleTimeString(undefined, timeOptions);
    const dateString = lastUpdated.toLocaleDateString(undefined, dateOptions);
    
    // Check if it's today
    const today = new Date();
    const isToday = lastUpdated.toDateString() === today.toDateString();
    
    if (isToday) {
      return `Last updated: Today at ${timeString}`;
    } else {
      return `Last updated: ${dateString} at ${timeString}`;
    }
  };

  // Handle sorting for different tables
  const handleSort = (sortKey, tableType) => {
    console.log('🔄 Sorting by:', sortKey, 'for table:', tableType);
    
    setSortConfigs(prev => {
      const currentConfig = prev[tableType];
      const newDirection = currentConfig?.key === sortKey && currentConfig?.direction === 'desc' ? 'asc' : 'desc';
      
      const newConfigs = {
        ...prev,
        [tableType]: { key: sortKey, direction: newDirection }
      };
      
      // Reload data with new sorting
      loadAllData(sortKey, newDirection, tableType);
      
      return newConfigs;
    });
  };

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

  // View details handler
  const handleViewDetails = (device) => {
    handleSystemSelect(device);
  };

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
              <button 
                onClick={handleManualRefresh} 
                className="refresh-button" 
                title={getLastUpdatedText()}
              >
                <Refresh size="16px" />
              </button>
              {isPolling && (
                <span className="polling-indicator" title="Auto-refresh every 30 seconds">
                  ●
                </span>
              )}
            </div>
          </div>
        </header>

        <Main className="main-content" background="background">
          <DashboardSummary devices={enrichedData} />
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium" style={{ position: 'relative' }}>
              {isRefreshing && (
                <div className="table-refresh-overlay">
                  <div className="table-refresh-spinner"></div>
                </div>
              )}
              <StorageDeviceTable 
                devices={enrichedData}
                onSort={handleSort}
                sortConfig={sortConfigs.main}
                onViewDetails={handleViewDetails}
                averageData={averageData}
              />
            </CardBody>
          </Card>
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium" style={{ position: 'relative' }}>
              {isRefreshing && (
                <div className="table-refresh-overlay">
                  <div className="table-refresh-spinner"></div>
                </div>
              )}
              <SustainabilityTable 
                devices={sustainabilityData.length > 0 ? sustainabilityData : enrichedData}
                onSort={handleSort}
                sortConfig={sortConfigs.sustainability}
                onViewDetails={handleViewDetails}
                averageData={averageData}
              />
            </CardBody>
          </Card>
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium" style={{ position: 'relative' }}>
              {isRefreshing && (
                <div className="table-refresh-overlay">
                  <div className="table-refresh-spinner"></div>
                </div>
              )}
              <PerformanceTable 
                devices={performanceData.length > 0 ? performanceData : enrichedData}
                onSort={handleSort}
                sortConfig={sortConfigs.performance}
                onViewDetails={handleViewDetails}
                averageData={averageData}
              />
            </CardBody>
          </Card>
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium" style={{ position: 'relative' }}>
              {isRefreshing && (
                <div className="table-refresh-overlay">
                  <div className="table-refresh-spinner"></div>
                </div>
              )}
              <FeatureTable 
                devices={featureData.length > 0 ? featureData : enrichedData}
                onSort={handleSort}
                sortConfig={sortConfigs.feature}
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

// SystemDetail Component (wrapper for routing)
function SystemDetail() {
  const { systemId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  
  // Load data to find the selected system
  useEffect(() => {
    const loadData = async () => {
      try {
        const devices = await StorageApiService.getStorageDevices();
        setData(devices);
      } catch (err) {
        console.error('Error loading system data:', err);
      }
    };
    loadData();
  }, []);

  // Convert systemId to number for comparison since mock data uses numeric IDs
  const numericSystemId = parseInt(systemId, 10);
  const selectedSystem = data.find(system => 
    system.id === systemId || system.id === numericSystemId
  );

  const handleBack = () => {
    navigate('/');
  };

  if (!data.length) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading system details...</p>
        </div>
      </div>
    );
  }

  if (!selectedSystem) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>System Not Found</h2>
          <p>System with ID "{systemId}" could not be found.</p>
          <button onClick={handleBack} className="retry-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <SystemDetailPage system={selectedSystem} onBack={handleBack} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/system/:systemId" element={<SystemDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
