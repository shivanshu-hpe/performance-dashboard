import React, { useState } from 'react'
import './App.css'
import StorageDeviceTable from './components/StorageDeviceTable'
import SustainabilityTable from './components/SustainabilityTable'
import PerformanceTable from './components/PerformanceTable'
import FeatureTable from './components/FeatureTable'
import SystemDetailPage from './components/SystemDetailPage'

// Mock data for HPE storage products - focusing on HPE GreenLake for File Storage
const mockHPEStorageData = [
  {
    id: 1,
    name: "HPE GreenLake for File Storage - Enterprise",
    productLine: "HPE GreenLake",
    type: "File Storage",
    tier: "Enterprise",
    capacity: "100TB",
    readSpeed: 6500,
    writeSpeed: 4800,
    iops: 850000,
    latency: 0.12,
    price: 15000,
    score: 94,
    greenScore: 92,
    featureScore: 88,
    dataReduction: "5:1",
    snapshots: "Yes",
    replication: "Yes",
    protocols: ["NFS", "SMB", "S3"],
    deployment: "Cloud-managed",
    sustainability: {
      powerEfficiency: 92,
      carbonReduction: 35
    }
  },
  {
    id: 2,
    name: "HPE GreenLake for File Storage - Standard",
    productLine: "HPE GreenLake",
    type: "File Storage",
    tier: "Standard",
    capacity: "50TB",
    readSpeed: 4200,
    writeSpeed: 3800,
    iops: 650000,
    latency: 0.18,
    price: 8500,
    score: 87,
    greenScore: 89,
    featureScore: 85,
    dataReduction: "4:1",
    snapshots: "Yes",
    replication: "Yes",
    protocols: ["NFS", "SMB"],
    deployment: "Cloud-managed",
    sustainability: {
      powerEfficiency: 88,
      carbonReduction: 30
    }
  },
  {
    id: 3,
    name: "HPE GreenLake for File Storage - Basic",
    productLine: "HPE GreenLake",
    type: "File Storage",
    tier: "Basic",
    capacity: "25TB",
    readSpeed: 2800,
    writeSpeed: 2400,
    iops: 420000,
    latency: 0.25,
    price: 4500,
    score: 78,
    greenScore: 84,
    featureScore: 75,
    dataReduction: "3:1",
    snapshots: "Yes",
    replication: "Optional",
    protocols: ["NFS", "SMB"],
    deployment: "Cloud-managed",
    sustainability: {
      powerEfficiency: 82,
      carbonReduction: 25
    }
  },
  {
    id: 4,
    name: "HPE Alletra 6000 File Storage",
    productLine: "HPE Alletra",
    type: "File Storage",
    tier: "High-Performance",
    capacity: "200TB",
    readSpeed: 8500,
    writeSpeed: 6200,
    iops: 1200000,
    latency: 0.08,
    price: 28000,
    score: 96,
    greenScore: 94,
    featureScore: 92,
    dataReduction: "6:1",
    snapshots: "Yes",
    replication: "Yes",
    protocols: ["NFS", "SMB", "S3", "iSCSI"],
    deployment: "On-premises",
    sustainability: {
      powerEfficiency: 95,
      carbonReduction: 40
    }
  },
  {
    id: 5,
    name: "HPE Alletra 9000 File Storage",
    productLine: "HPE Alletra",
    type: "File Storage",
    tier: "Mission-Critical",
    capacity: "500TB",
    readSpeed: 12000,
    writeSpeed: 8500,
    iops: 1800000,
    latency: 0.05,
    price: 65000,
    score: 98,
    greenScore: 96,
    featureScore: 95,
    dataReduction: "8:1",
    snapshots: "Yes",
    replication: "Yes",
    protocols: ["NFS", "SMB", "S3", "iSCSI", "FC"],
    deployment: "On-premises",
    sustainability: {
      powerEfficiency: 98,
      carbonReduction: 45
    }
  },
  {
    id: 6,
    name: "HPE Primera File Services",
    productLine: "HPE Primera",
    type: "File Storage",
    tier: "Mission-Critical",
    capacity: "1PB",
    readSpeed: 15000,
    writeSpeed: 11000,
    iops: 2200000,
    latency: 0.03,
    price: 120000,
    score: 99,
    greenScore: 98,
    featureScore: 97,
    dataReduction: "10:1",
    snapshots: "Yes",
    replication: "Yes",
    protocols: ["NFS", "SMB", "S3", "iSCSI", "FC", "NVMe-oF"],
    deployment: "On-premises",
    sustainability: {
      powerEfficiency: 99,
      carbonReduction: 50
    }
  }
];

// HPE Industry Average Benchmarks for comparison
const hpeBenchmarkData = {
  overview: {
    deviceScore: 85,
    score: 82,
    hpePerformanceScore: 88
  },
  sustainability: {
    greenScore: 78,
    powerEfficiency: 75,
    carbonReduction: 25
  },
  performance: {
    score: 82,
    readSpeed: 3500,
    writeSpeed: 2800,
    iops: 400000,
    latency: 0.25
  },
  features: {
    featureScore: 80,
    dataReductionRatio: 3.5,
    protocolsSupported: 3.2
  }
};

function App() {
  // Calculate overall device score for each device
  const enrichedData = mockHPEStorageData.map(device => ({
    ...device,
    deviceScore: Math.round((device.score + device.greenScore + device.featureScore) / 3)
  }));

  // Calculate averages from the mock data
  const calculateAverages = (data) => {
    const totals = data.reduce((acc, device) => {
      acc.deviceScore += device.deviceScore;
      acc.score += device.score;
      acc.greenScore += device.greenScore;
      acc.featureScore += device.featureScore;
      acc.readSpeed += device.readSpeed;
      acc.writeSpeed += device.writeSpeed;
      acc.iops += device.iops;
      acc.latency += device.latency;
      acc.powerEfficiency += device.sustainability.powerEfficiency;
      acc.carbonReduction += device.sustainability.carbonReduction;
      return acc;
    }, {
      deviceScore: 0, score: 0, greenScore: 0, featureScore: 0,
      readSpeed: 0, writeSpeed: 0, iops: 0, latency: 0,
      powerEfficiency: 0, carbonReduction: 0
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
      latency: Number((totals.latency / count).toFixed(2)),
      sustainability: {
        powerEfficiency: Math.round(totals.powerEfficiency / count),
        carbonReduction: Math.round(totals.carbonReduction / count)
      }
    };
  };

  const averageData = calculateAverages(enrichedData);
  
  const [hpeStorageData, setHpeStorageData] = useState(enrichedData);
  const [sortConfig, setSortConfig] = useState({ key: 'deviceScore', direction: 'desc' });
  const [selectedSystem, setSelectedSystem] = useState(null);

  // Sort the data based on current sort configuration
  const sortedData = React.useMemo(() => {
    let sortableData = [...hpeStorageData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        // Handle nested properties like sustainability.powerEfficiency
        const getNestedValue = (obj, path) => {
          return path.split('.').reduce((value, key) => value && value[key], obj);
        };
        
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          if (sortConfig.direction === 'asc') {
            return aValue - bValue;
          }
          return bValue - aValue;
        }
        
        if (sortConfig.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        }
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      });
    }
    return sortableData;
  }, [hpeStorageData, sortConfig]);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewDetails = (system) => {
    setSelectedSystem(system);
  };

  const handleBackToList = () => {
    setSelectedSystem(null);
  };

  const handleViewInsights = (tableType) => {
    const avgData = calculateTableAverages(sortedData);
    const metrics = getMetricsForTable(tableType);
    
    setInsightsView(tableType);
    setInsightsData({
      averageData: avgData,
      hpeBenchmark: hpeBenchmarkData[tableType],
      metrics: metrics
    });
  };

  const handleCloseInsights = () => {
    setInsightsView(null);
    setInsightsData(null);
  };

  const calculateTableAverages = (data) => {
    const totals = data.reduce((acc, device) => {
      acc.deviceScore += device.deviceScore;
      acc.score += device.score;
      acc.greenScore += device.greenScore;
      acc.featureScore += device.featureScore;
      acc.readSpeed += device.readSpeed;
      acc.writeSpeed += device.writeSpeed;
      acc.iops += device.iops;
      acc.latency += device.latency;
      acc.powerEfficiency += device.sustainability.powerEfficiency;
      acc.carbonReduction += device.sustainability.carbonReduction;
      return acc;
    }, {
      deviceScore: 0, score: 0, greenScore: 0, featureScore: 0,
      readSpeed: 0, writeSpeed: 0, iops: 0, latency: 0,
      powerEfficiency: 0, carbonReduction: 0
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
      latency: (totals.latency / count).toFixed(2),
      sustainability: {
        powerEfficiency: Math.round(totals.powerEfficiency / count),
        carbonReduction: Math.round(totals.carbonReduction / count)
      }
    };
  };

  const getMetricsForTable = (tableType) => {
    switch (tableType) {
      case 'overview':
        return [
          { label: 'Device Score', getValue: (data) => data.deviceScore, unit: '/100' },
          { label: 'Performance Score', getValue: (data) => data.score, unit: '/100' },
          { label: 'Performance Score', getValue: (data) => data.hpePerformanceScore || data.score, unit: '/100' }
        ];
      case 'sustainability':
        return [
          { label: 'Green Score', getValue: (data) => data.greenScore, unit: '/100' },
          { label: 'Power Efficiency', getValue: (data) => data.powerEfficiency || data.sustainability?.powerEfficiency, unit: '/100' },
          { label: 'Carbon Reduction', getValue: (data) => data.carbonReduction || data.sustainability?.carbonReduction, unit: '%' }
        ];
      case 'performance':
        return [
          { label: 'Performance Score', getValue: (data) => data.score, unit: '/100' },
          { label: 'Read Speed', getValue: (data) => data.readSpeed, unit: ' MB/s' },
          { label: 'Write Speed', getValue: (data) => data.writeSpeed, unit: ' MB/s' },
          { label: 'IOPS', getValue: (data) => data.iops, unit: '' },
          { label: 'Latency', getValue: (data) => parseFloat(data.latency), unit: ' ms', inverted: true }
        ];
      case 'features':
        return [
          { label: 'Feature Score', getValue: (data) => data.featureScore, unit: '/100' },
          { label: 'Data Reduction', getValue: (data) => data.dataReductionRatio || 3.5, unit: ':1' },
          { label: 'Protocols Supported', getValue: (data) => data.protocolsSupported || 3.2, unit: '' }
        ];
      default:
        return [];
    }
  };

  // If a system is selected, show the detail page
  if (selectedSystem) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="hpe-branding">
              <span className="hpe-logo">HPE</span>
              <div className="header-text">
                <h1 className="header-title">HPE Storage Performance Dashboard</h1>
                <p className="header-subtitle">Detailed analysis of {selectedSystem.name}</p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="app-main">
          <SystemDetailPage 
            system={selectedSystem} 
            onBack={handleBackToList}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="hpe-branding">
            <span className="hpe-logo">HPE</span>
            <div className="header-text">
              <h1 className="header-title">HPE Storage Performance Dashboard</h1>
              <p className="header-subtitle">Comprehensive analysis and comparison of HPE storage solutions</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <StorageDeviceTable 
          devices={sortedData}
          onSort={handleSort}
          sortConfig={sortConfig}
          onViewDetails={handleViewDetails}
          averageData={averageData}
        />
        
        <SustainabilityTable 
          devices={sortedData}
          onSort={handleSort}
          sortConfig={sortConfig}
          onViewDetails={handleViewDetails}
          averageData={averageData}
        />
        
        <PerformanceTable 
          devices={sortedData}
          onSort={handleSort}
          sortConfig={sortConfig}
          onViewDetails={handleViewDetails}
          averageData={averageData}
        />
        
        <FeatureTable 
          devices={sortedData}
          onSort={handleSort}
          sortConfig={sortConfig}
          onViewDetails={handleViewDetails}
          averageData={averageData}
        />
      </main>
    </div>
  )
}

export default App
