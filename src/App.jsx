import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
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

// Dashboard Component
function Dashboard() {
  const navigate = useNavigate();
  
  // Main state for data
  const [data, setData] = useState([]);
  const [sustainabilityData, setSustainabilityData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [featureData, setFeatureData] = useState([]);
  
  // Sorting state for each table
  const [storageSort, setStorageSort] = useState({ sortBy: 'deviceScore', sortOrder: 'asc' });
  const [sustainabilitySort, setSustainabilitySort] = useState({ sortBy: 'greenScore', sortOrder: 'asc' });
  const [performanceSort, setPerformanceSort] = useState({ sortBy: 'score', sortOrder: 'asc' });
  const [featureSort, setFeatureSort] = useState({ sortBy: 'featureScore', sortOrder: 'asc' });
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all data from API or mock with sorting
  const loadAllData = async (
    storageSortParams = storageSort,
    sustainabilitySortParams = sustainabilitySort,
    performanceSortParams = performanceSort,
    featureSortParams = featureSort
  ) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Loading storage data...');
      
      // Load all data in parallel for better performance with sorting
      const [devices, sustainability, performance, features] = await Promise.all([
        StorageApiService.getStorageDevices(storageSortParams.sortBy, storageSortParams.sortOrder),
        StorageApiService.getSustainabilityMetrics(sustainabilitySortParams.sortBy, sustainabilitySortParams.sortOrder),
        StorageApiService.getPerformanceMetrics(performanceSortParams.sortBy, performanceSortParams.sortOrder),
        StorageApiService.getFeatureComparison(featureSortParams.sortBy, featureSortParams.sortOrder),
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

  // Sorting handlers for each table
  const handleStorageSortChange = (sortBy, sortOrder) => {
    const newSort = { sortBy, sortOrder };
    setStorageSort(newSort);
    loadAllData(newSort, sustainabilitySort, performanceSort, featureSort);
  };

  const handleSustainabilitySortChange = (sortBy, sortOrder) => {
    const newSort = { sortBy, sortOrder };
    setSustainabilitySort(newSort);
    loadAllData(storageSort, newSort, performanceSort, featureSort);
  };

  const handlePerformanceSortChange = (sortBy, sortOrder) => {
    const newSort = { sortBy, sortOrder };
    setPerformanceSort(newSort);
    loadAllData(storageSort, sustainabilitySort, newSort, featureSort);
  };

  const handleFeatureSortChange = (sortBy, sortOrder) => {
    const newSort = { sortBy, sortOrder };
    setFeatureSort(newSort);
    loadAllData(storageSort, sustainabilitySort, performanceSort, newSort);
  };

  // Handle system selection (navigate to detail page)
  const handleSystemSelect = (system) => {
    console.log('📱 Navigating to system:', system.name);
    navigate(`/system/${system.id}`);
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
                devices={enrichedData}
                onViewDetails={handleViewDetails}
                averageData={averageData}
                sortBy={storageSort.sortBy}
                sortOrder={storageSort.sortOrder}
                onSort={handleStorageSortChange}
              />
            </CardBody>
          </Card>
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium">
              <SustainabilityTable 
                devices={sustainabilityData.length > 0 ? sustainabilityData : enrichedData}
                onViewDetails={handleViewDetails}
                averageData={averageData}
                sortBy={sustainabilitySort.sortBy}
                sortOrder={sustainabilitySort.sortOrder}
                onSort={handleSustainabilitySortChange}
              />
            </CardBody>
          </Card>
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium">
              <PerformanceTable 
                devices={performanceData.length > 0 ? performanceData : enrichedData}
                onViewDetails={handleViewDetails}
                averageData={averageData}
                sortBy={performanceSort.sortBy}
                sortOrder={performanceSort.sortOrder}
                onSort={handlePerformanceSortChange}
              />
            </CardBody>
          </Card>
          
          <Card margin={{ vertical: 'medium' }} elevation="small">
            <CardBody pad="medium">
              <FeatureTable 
                devices={featureData.length > 0 ? featureData : enrichedData}
                onViewDetails={handleViewDetails}
                averageData={averageData}
                sortBy={featureSort.sortBy}
                sortOrder={featureSort.sortOrder}
                onSort={handleFeatureSortChange}
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
