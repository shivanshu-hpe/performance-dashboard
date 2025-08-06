import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './SystemDetailPage.css';

const SystemDetailPage = ({ system, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1W');
  const capacityChartRef = useRef();
  const performanceChartRef = useRef();
  const greenScoreChartRef = useRef();
  const sustainabilityChartRef = useRef();
  const latencyChartRef = useRef();
  const iopsChartRef = useRef();
  const throughputChartRef = useRef();

  // Mock time series data
  const generateTimeSeriesData = (baseValue, variance = 10, trend = 0) => {
    const data = [];
    const now = new Date();
    const days = timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : 90;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const randomVariance = (Math.random() - 0.5) * variance;
      const trendEffect = trend * (days - i) / days;
      const value = Math.max(0, Math.min(100, baseValue + randomVariance + trendEffect));
      
      data.push({
        date,
        value: parseFloat(value.toFixed(2))
      });
    }
    return data;
  };

  const capacityData = generateTimeSeriesData(45.8, 5, 2);
  const performanceData = generateTimeSeriesData(85, 8, -1);
  const greenScoreData = generateTimeSeriesData(92, 3, 1);
  const sustainabilityData = generateTimeSeriesData(88, 4, 2);
  
  // Performance-specific metrics
  const latencyData = generateTimeSeriesData(system?.latency || 0.12, 0.02, 0);
  const iopsData = generateTimeSeriesData((system?.iops || 850000) / 10000, 50, 10); // Scale down for visualization
  const throughputData = generateTimeSeriesData((system?.readSpeed || 6500) / 100, 10, -2); // Scale down read speed

  useEffect(() => {
    if (activeTab === 'performance') {
      createTimeChart(capacityChartRef.current, capacityData, 'Capacity Usage (GiB)', '#4ECDC4', 'GiB');
      createTimeChart(latencyChartRef.current, latencyData, 'Latency (ms)', '#45B7AA', 'ms');
      createTimeChart(iopsChartRef.current, iopsData, 'IOPS (x10K)', '#3DA58A', 'K');
      createTimeChart(throughputChartRef.current, throughputData, 'Throughput (x100 MB/s)', '#36967D', 'MB/s');
    }
    if (activeTab === 'sustainability') {
      createTimeChart(greenScoreChartRef.current, greenScoreData, 'Green Score', '#01A982', 'pts');
      createTimeChart(sustainabilityChartRef.current, sustainabilityData, 'Sustainability Index', '#00854C', 'pts');
    }
  }, [activeTab, timeRange]);

  const createTimeChart = (container, data, title, color, unit) => {
    if (!container) return;

    const svg = d3.select(container);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 80, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svgElement = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svgElement.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1])
      .range([height, 0]);

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Area generator for gradient fill
    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Gradient definition
    const gradient = g.append("defs")
      .append("linearGradient")
      .attr("id", `gradient-${title.replace(/\s+/g, '')}`)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", height)
      .attr("x2", 0).attr("y2", 0);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0.1);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color)
      .attr("stop-opacity", 0.6);

    // Add area
    g.append("path")
      .datum(data)
      .attr("fill", `url(#gradient-${title.replace(/\s+/g, '')})`)
      .attr("d", area);

    // Add line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots
    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.value))
      .attr("r", 3)
      .attr("fill", color)
      .on("mouseover", function(event, d) {
        const tooltip = d3.select("body").append("div")
          .attr("class", "chart-tooltip")
          .style("opacity", 0);

        tooltip.transition()
          .duration(200)
          .style("opacity", .9);

        tooltip.html(`
          <div class="tooltip-header">${title}</div>
          <div class="tooltip-content">
            <div class="tooltip-row">
              <span class="tooltip-label">Date:</span>
              <span class="tooltip-value">${d.date.toLocaleDateString()}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">Value:</span>
              <span class="tooltip-value">${d.value} ${unit}</span>
            </div>
          </div>
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.selectAll(".chart-tooltip").remove();
      });

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%d %b"))
        .ticks(6));

    // Y axis
    g.append("g")
      .call(d3.axisLeft(yScale));

    // Chart title
    g.append("text")
      .attr("transform", `translate(${width/2}, -10)`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .text(title);

    // Y axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text(unit);
  };

  const featureAnalysis = {
    critical: [
      { name: 'Data Reduction', status: 'available', description: 'Advanced compression and deduplication' },
      { name: 'Snapshot', status: 'unavailable', description: 'Point-in-time data copies' },
      { name: 'Replication', status: 'unavailable', description: 'Data replication across sites' },
      { name: 'Audit Logs', status: 'available', description: 'Comprehensive audit trail' },
      { name: 'Active Directory & LDAP', status: 'available', description: 'Enterprise authentication' },
      { name: 'NFS, NFSv4, SMB Protocols', status: 'available', description: 'Multi-protocol file access' }
    ],
    optional: [
      { name: 'Share Settings', status: 'available', description: 'Advanced share configuration' },
      { name: 'Protection Policies', status: 'available', description: 'Data protection policies' }
    ]
  };

  if (!system) {
    return (
      <div className="system-detail-page">
        <div className="error-state">
          <h2>No System Selected</h2>
          <p>Please select a system to view detailed metrics.</p>
          <button onClick={onBack} className="back-button">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="system-detail-page">
      <div className="detail-header">
        <button onClick={onBack} className="back-button">
          ← Back to Dashboard
        </button>
        <div className="system-info">
          <h1>{system.name}</h1>
          <div className="system-meta">
            <span className="system-type">{system.productLine}</span>
            <span className="system-tier">{system.tier}</span>
            <span className="system-capacity">{system.capacity}</span>
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'sustainability' ? 'active' : ''}`}
          onClick={() => setActiveTab('sustainability')}
        >
          Sustainability Metrics
        </button>
        <button 
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance Metrics
        </button>
        <button 
          className={`tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          Feature Analysis
        </button>
      </div>

      <div className="detail-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Performance Summary</h3>
                <div className="metric-row">
                  <span>Performance Score:</span>
                  <span className="metric-value">{system.score}/100</span>
                </div>
                <div className="metric-row">
                  <span>Read Speed:</span>
                  <span className="metric-value">{system.readSpeed} MB/s</span>
                </div>
                <div className="metric-row">
                  <span>Write Speed:</span>
                  <span className="metric-value">{system.writeSpeed} MB/s</span>
                </div>
                <div className="metric-row">
                  <span>IOPS:</span>
                  <span className="metric-value">{system.iops.toLocaleString()}</span>
                </div>
                <div className="metric-row">
                  <span>Latency:</span>
                  <span className="metric-value">{system.latency} ms</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Configuration Details</h3>
                <div className="metric-row">
                  <span>Deployment:</span>
                  <span className="metric-value">{system.deployment}</span>
                </div>
                <div className="metric-row">
                  <span>Data Reduction:</span>
                  <span className="metric-value">{system.dataReduction}</span>
                </div>
                <div className="metric-row">
                  <span>Storage Type:</span>
                  <span className="metric-value">{system.type}</span>
                </div>
                <div className="metric-row">
                  <span>Price:</span>
                  <span className="metric-value">${system.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sustainability' && (
          <div className="sustainability-tab">
            <div className="metrics-header">
              <h2>Sustainability Metrics</h2>
              <div className="time-range-selector">
                <button 
                  className={`time-btn ${timeRange === '1W' ? 'active' : ''}`}
                  onClick={() => setTimeRange('1W')}
                >
                  1W
                </button>
                <button 
                  className={`time-btn ${timeRange === '1M' ? 'active' : ''}`}
                  onClick={() => setTimeRange('1M')}
                >
                  1M
                </button>
                <button 
                  className={`time-btn ${timeRange === '3M' ? 'active' : ''}`}
                  onClick={() => setTimeRange('3M')}
                >
                  3M
                </button>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <svg ref={greenScoreChartRef}></svg>
              </div>
              
              <div className="chart-container">
                <svg ref={sustainabilityChartRef}></svg>
              </div>
            </div>

            <div className="sustainability-summary">
              <div className="summary-card">
                <h4>Current Sustainability Status</h4>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="status-label">Green Score:</span>
                    <span className="status-value">92/100</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Power Efficiency:</span>
                    <span className="status-value">{system.sustainability?.powerEfficiency || 95}%</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Carbon Reduction:</span>
                    <span className="status-value">{system.sustainability?.carbonReduction || 40}%</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Energy Rating:</span>
                    <span className="status-value">A+ Certified</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Data Reduction Ratio:</span>
                    <span className="status-value">{system.dataReduction}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Sustainability Index:</span>
                    <span className="status-value">88/100</span>
                  </div>
                </div>
              </div>

              <div className="sustainability-insights">
                <div className="insight-card">
                  <h4>Environmental Impact</h4>
                  <div className="impact-metrics">
                    <div className="impact-item">
                      <span className="impact-icon">🌱</span>
                      <div className="impact-content">
                        <span className="impact-title">CO₂ Savings</span>
                        <span className="impact-value">{system.sustainability?.carbonReduction || 40}% reduction vs traditional storage</span>
                      </div>
                    </div>
                    <div className="impact-item">
                      <span className="impact-icon">⚡</span>
                      <div className="impact-content">
                        <span className="impact-title">Energy Efficiency</span>
                        <span className="impact-value">{system.sustainability?.powerEfficiency || 95}% efficient power usage</span>
                      </div>
                    </div>
                    <div className="impact-item">
                      <span className="impact-icon">📦</span>
                      <div className="impact-content">
                        <span className="impact-title">Space Optimization</span>
                        <span className="impact-value">{system.dataReduction} data reduction ratio</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-tab">
            <div className="metrics-header">
              <h2>Performance Metrics</h2>
              <div className="time-range-selector">
                <button 
                  className={`time-btn ${timeRange === '1W' ? 'active' : ''}`}
                  onClick={() => setTimeRange('1W')}
                >
                  1W
                </button>
                <button 
                  className={`time-btn ${timeRange === '1M' ? 'active' : ''}`}
                  onClick={() => setTimeRange('1M')}
                >
                  1M
                </button>
                <button 
                  className={`time-btn ${timeRange === '3M' ? 'active' : ''}`}
                  onClick={() => setTimeRange('3M')}
                >
                  3M
                </button>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <h5>Capacity Usage</h5>
                <svg ref={capacityChartRef}></svg>
              </div>
              
              <div className="chart-container">
                <h5>Latency</h5>
                <svg ref={latencyChartRef}></svg>
              </div>
              
              <div className="chart-container">
                <h5>IOPS Performance</h5>
                <svg ref={iopsChartRef}></svg>
              </div>
              
              <div className="chart-container">
                <h5>Throughput</h5>
                <svg ref={throughputChartRef}></svg>
              </div>
            </div>

            <div className="metrics-summary">
              <div className="summary-card">
                <h4>Current Performance Status</h4>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="status-label">Capacity Usage:</span>
                    <span className="status-value">45.03 GiB (0.07%)</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Performance Score:</span>
                    <span className="status-value">{system.score}/100</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Read Speed:</span>
                    <span className="status-value">{system.readSpeed} MB/s</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Write Speed:</span>
                    <span className="status-value">{system.writeSpeed} MB/s</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">IOPS:</span>
                    <span className="status-value">{system.iops.toLocaleString()}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Latency:</span>
                    <span className="status-value">{system.latency} ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="features-tab">
            <div className="feature-analysis">
              <h2>Feature Analysis</h2>
              
              <div className="features-grid">
                <div className="feature-section">
                  <h3>Critical Features</h3>
                  <div className="feature-list">
                    {featureAnalysis.critical.map((feature, index) => (
                      <div key={index} className={`feature-item ${feature.status}`}>
                        <div className="feature-header">
                          <span className={`feature-icon ${feature.status}`}>
                            {feature.status === 'available' ? '✓' : '✗'}
                          </span>
                          <span className="feature-name">{feature.name}</span>
                        </div>
                        <p className="feature-description">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="feature-section">
                  <h3>Optional Features</h3>
                  <div className="feature-list">
                    {featureAnalysis.optional.map((feature, index) => (
                      <div key={index} className={`feature-item ${feature.status}`}>
                        <div className="feature-header">
                          <span className={`feature-icon ${feature.status}`}>
                            {feature.status === 'available' ? '✓' : '✗'}
                          </span>
                          <span className="feature-name">{feature.name}</span>
                        </div>
                        <p className="feature-description">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sustainability' && (
          <div className="sustainability-tab">
            <div className="metrics-header">
              <h2>Sustainability Metrics</h2>
              <div className="time-range-selector">
                <button 
                  className={`time-btn ${timeRange === '1W' ? 'active' : ''}`}
                  onClick={() => setTimeRange('1W')}
                >
                  1W
                </button>
                <button 
                  className={`time-btn ${timeRange === '1M' ? 'active' : ''}`}
                  onClick={() => setTimeRange('1M')}
                >
                  1M
                </button>
                <button 
                  className={`time-btn ${timeRange === '3M' ? 'active' : ''}`}
                  onClick={() => setTimeRange('3M')}
                >
                  3M
                </button>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <svg ref={greenScoreChartRef}></svg>
              </div>
              
              <div className="chart-container">
                <svg ref={sustainabilityChartRef}></svg>
              </div>
            </div>

            <div className="sustainability-summary">
              <div className="summary-card">
                <h4>Current Sustainability Status</h4>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="status-label">Green Score:</span>
                    <span className="status-value">92/100</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Power Efficiency:</span>
                    <span className="status-value">{system.sustainability?.powerEfficiency || 95}%</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Carbon Reduction:</span>
                    <span className="status-value">{system.sustainability?.carbonReduction || 40}%</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Energy Rating:</span>
                    <span className="status-value">A+ Certified</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Data Reduction Ratio:</span>
                    <span className="status-value">{system.dataReduction}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Sustainability Index:</span>
                    <span className="status-value">88/100</span>
                  </div>
                </div>
              </div>

              <div className="sustainability-insights">
                <div className="insight-card">
                  <h4>Environmental Impact</h4>
                  <div className="impact-metrics">
                    <div className="impact-item">
                      <span className="impact-icon">🌱</span>
                      <div className="impact-content">
                        <span className="impact-title">CO₂ Savings</span>
                        <span className="impact-value">{system.sustainability?.carbonReduction || 40}% reduction vs traditional storage</span>
                      </div>
                    </div>
                    <div className="impact-item">
                      <span className="impact-icon">⚡</span>
                      <div className="impact-content">
                        <span className="impact-title">Energy Efficiency</span>
                        <span className="impact-value">{system.sustainability?.powerEfficiency || 95}% efficient power usage</span>
                      </div>
                    </div>
                    <div className="impact-item">
                      <span className="impact-icon">📦</span>
                      <div className="impact-content">
                        <span className="impact-title">Space Optimization</span>
                        <span className="impact-value">{system.dataReduction} data reduction ratio</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemDetailPage;
