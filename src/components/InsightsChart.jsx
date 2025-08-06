import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './InsightsChart.css';

const InsightsChart = ({ 
  title, 
  deviceData, 
  hpeBenchmark, 
  metrics, 
  chartType = 'bar',
  onClose 
}) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!deviceData || !hpeBenchmark || !metrics) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 80, bottom: 80, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    if (chartType === 'bar') {
      drawBarChart(g, width, height, deviceData, hpeBenchmark, metrics);
    } else if (chartType === 'radar') {
      drawRadarChart(g, width, height, deviceData, hpeBenchmark, metrics);
    }
  }, [deviceData, hpeBenchmark, metrics, chartType]);

  const drawBarChart = (g, width, height, deviceData, hpeBenchmark, metrics) => {
    const data = metrics.map(metric => ({
      metric: metric.label,
      device: metric.getValue(deviceData),
      benchmark: metric.getValue(hpeBenchmark),
      unit: metric.unit || ''
    }));

    const x0 = d3.scaleBand()
      .domain(data.map(d => d.metric))
      .rangeRound([0, width])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(['device', 'benchmark'])
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.device, d.benchmark)) * 1.1])
      .range([height, 0]);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .style("font-size", "11px")
      .style("fill", "#666");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "11px")
      .style("fill", "#666");

    // Device bars
    g.selectAll(".device-bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "device-bar")
      .attr("x", d => x0(d.metric) + x1('device'))
      .attr("y", d => y(d.device))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.device))
      .attr("fill", "#01A982");

    // Benchmark bars
    g.selectAll(".benchmark-bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "benchmark-bar")
      .attr("x", d => x0(d.metric) + x1('benchmark'))
      .attr("y", d => y(d.benchmark))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.benchmark))
      .attr("fill", "#B0BEC5");

    // Value labels on bars
    g.selectAll(".device-label")
      .data(data)
      .enter().append("text")
      .attr("class", "device-label")
      .attr("x", d => x0(d.metric) + x1('device') + x1.bandwidth() / 2)
      .attr("y", d => y(d.device) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#01A982")
      .style("font-weight", "600")
      .text(d => `${d.device}${d.unit}`);

    g.selectAll(".benchmark-label")
      .data(data)
      .enter().append("text")
      .attr("class", "benchmark-label")
      .attr("x", d => x0(d.metric) + x1('benchmark') + x1.bandwidth() / 2)
      .attr("y", d => y(d.benchmark) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#666")
      .style("font-weight", "600")
      .text(d => `${d.benchmark}${d.unit}`);

    // Legend
    const legend = g.append("g")
      .attr("transform", `translate(${width - 120}, 20)`);

    legend.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", "#01A982");

    legend.append("text")
      .attr("x", 16)
      .attr("y", 9)
      .style("font-size", "11px")
      .style("fill", "#333")
      .text("This Device");

    legend.append("rect")
      .attr("x", 0)
      .attr("y", 20)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", "#B0BEC5");

    legend.append("text")
      .attr("x", 16)
      .attr("y", 29)
      .style("font-size", "11px")
      .style("fill", "#333")
      .text("HPE Average");
  };

  const drawRadarChart = (g, width, height, deviceData, hpeBenchmark, metrics) => {
    const radius = Math.min(width, height) / 2 - 20;
    const centerX = width / 2;
    const centerY = height / 2;

    const angleSlice = (Math.PI * 2) / metrics.length;

    // Normalize data to 0-100 scale
    const normalizeValue = (value, metric) => {
      const maxVal = Math.max(
        metric.getValue(deviceData),
        metric.getValue(hpeBenchmark),
        metric.maxValue || 100
      );
      return (value / maxVal) * 100;
    };

    const deviceValues = metrics.map(metric => normalizeValue(metric.getValue(deviceData), metric));
    const benchmarkValues = metrics.map(metric => normalizeValue(metric.getValue(hpeBenchmark), metric));

    // Grid circles
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      g.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", (radius / levels) * level)
        .style("fill", "none")
        .style("stroke", "#E0E0E0")
        .style("stroke-width", "1px");
    }

    // Axis lines and labels
    metrics.forEach((metric, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      g.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", x)
        .attr("y2", y)
        .style("stroke", "#E0E0E0")
        .style("stroke-width", "1px");

      g.append("text")
        .attr("x", centerX + Math.cos(angle) * (radius + 15))
        .attr("y", centerY + Math.sin(angle) * (radius + 15))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "11px")
        .style("fill", "#666")
        .text(metric.label);
    });

    // Device polygon
    const deviceLine = d3.line()
      .x((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return centerX + Math.cos(angle) * ((d / 100) * radius);
      })
      .y((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return centerY + Math.sin(angle) * ((d / 100) * radius);
      })
      .curve(d3.curveLinearClosed);

    g.append("path")
      .datum(deviceValues)
      .attr("d", deviceLine)
      .style("fill", "#01A982")
      .style("fill-opacity", 0.3)
      .style("stroke", "#01A982")
      .style("stroke-width", "2px");

    // Benchmark polygon
    g.append("path")
      .datum(benchmarkValues)
      .attr("d", deviceLine)
      .style("fill", "#B0BEC5")
      .style("fill-opacity", 0.2)
      .style("stroke", "#B0BEC5")
      .style("stroke-width", "2px")
      .style("stroke-dasharray", "5,5");

    // Data points
    deviceValues.forEach((value, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = centerX + Math.cos(angle) * ((value / 100) * radius);
      const y = centerY + Math.sin(angle) * ((value / 100) * radius);

      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4)
        .style("fill", "#01A982");
    });

    benchmarkValues.forEach((value, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = centerX + Math.cos(angle) * ((value / 100) * radius);
      const y = centerY + Math.sin(angle) * ((value / 100) * radius);

      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 3)
        .style("fill", "#B0BEC5");
    });

    // Legend
    const legend = g.append("g")
      .attr("transform", `translate(20, 20)`);

    legend.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 20)
      .attr("y2", 0)
      .style("stroke", "#01A982")
      .style("stroke-width", "2px");

    legend.append("text")
      .attr("x", 25)
      .attr("y", 4)
      .style("font-size", "11px")
      .style("fill", "#333")
      .text("This Device");

    legend.append("line")
      .attr("x1", 0)
      .attr("y1", 20)
      .attr("x2", 20)
      .attr("y2", 20)
      .style("stroke", "#B0BEC5")
      .style("stroke-width", "2px")
      .style("stroke-dasharray", "5,5");

    legend.append("text")
      .attr("x", 25)
      .attr("y", 24)
      .style("font-size", "11px")
      .style("fill", "#333")
      .text("HPE Average");
  };

  return (
    <div className="insights-chart-overlay">
      <div className="insights-chart-modal">
        <div className="insights-chart-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="insights-chart-content">
          <svg ref={svgRef}></svg>
          <div className="insights-summary">
            <h4>Performance Analysis</h4>
            <div className="comparison-stats">
              {metrics.map((metric, index) => {
                const deviceValue = metric.getValue(deviceData);
                const benchmarkValue = metric.getValue(hpeBenchmark);
                const difference = ((deviceValue - benchmarkValue) / benchmarkValue * 100).toFixed(1);
                const isBetter = deviceValue > benchmarkValue;
                
                return (
                  <div key={index} className="stat-comparison">
                    <span className="metric-name">{metric.label}:</span>
                    <span className={`performance-indicator ${isBetter ? 'better' : 'worse'}`}>
                      {isBetter ? '+' : ''}{difference}% vs HPE Avg
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsChart;
