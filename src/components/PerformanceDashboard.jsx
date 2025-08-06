import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './PerformanceDashboard.css';

const PerformanceDashboard = ({ devices, onDeviceSelect }) => {
  const barChartRef = useRef();
  const radarChartRef = useRef();
  const scatterPlotRef = useRef();

  useEffect(() => {
    if (devices.length > 0) {
      createBarChart();
      createRadarChart();
      createScatterPlot();
    }
  }, [devices]);

  const createBarChart = () => {
    const svgElement = d3.select(barChartRef.current);
    svgElement.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = svgElement
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data for grouped bar chart
    const metrics = ['readSpeed', 'writeSpeed', 'score'];
    const data = devices.map(device => ({
      name: device.name.split(' ').slice(0, 2).join(' '), // Shortened name
      readSpeed: device.readSpeed / 100, // Scale down for better visualization
      writeSpeed: device.writeSpeed / 100,
      score: device.score
    }));

    const x0 = d3.scaleBand()
      .domain(data.map(d => d.name))
      .rangeRound([0, width])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(metrics)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.readSpeed, d.writeSpeed, d.score))])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(metrics)
      .range(['#01A982', '#45B7AA', '#3DA58A']);

    // X axis
    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Y axis
    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    // Bars
    const deviceGroups = g.selectAll(".device-group")
      .data(data)
      .enter().append("g")
      .attr("class", "device-group")
      .attr("transform", d => `translate(${x0(d.name)},0)`);

    deviceGroups.selectAll("rect")
      .data(d => metrics.map(key => ({ key, value: d[key], device: d.name })))
      .enter().append("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key))
      .on("mouseover", function(event, d) {
        d3.select(this).style("opacity", 0.8);
        // Add tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`${d.device}<br/>${d.key}: ${d.value}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 1);
        d3.selectAll(".tooltip").remove();
      });

    // Legend
    const legend = g.selectAll(".legend")
      .data(metrics)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(${width - 100},${i * 20})`);

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(d => {
        switch(d) {
          case 'readSpeed': return 'Read Speed (x100 MB/s)';
          case 'writeSpeed': return 'Write Speed (x100 MB/s)';
          case 'score': return 'Performance Score';
          default: return d;
        }
      });
  };

  const createRadarChart = () => {
    const svgElement = d3.select(radarChartRef.current);
    svgElement.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = svgElement
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    // Radar chart metrics
    const metrics = [
      { key: 'readSpeed', label: 'Read Speed', max: 7000 },
      { key: 'writeSpeed', label: 'Write Speed', max: 5500 },
      { key: 'iops', label: 'IOPS', max: 1000000 },
      { key: 'score', label: 'Score', max: 100 }
    ];

    const angleSlice = Math.PI * 2 / metrics.length;

    // Create the background circles
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      g.append("circle")
        .attr("r", radius * level / levels)
        .style("fill", "none")
        .style("stroke", "#CDCDCD")
        .style("stroke-width", "1px");
    }

    // Create the axis lines
    metrics.forEach((metric, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", radius * Math.cos(angle))
        .attr("y2", radius * Math.sin(angle))
        .style("stroke", "#CDCDCD")
        .style("stroke-width", "2px");

      // Add labels
      g.append("text")
        .attr("x", radius * 1.1 * Math.cos(angle))
        .attr("y", radius * 1.1 * Math.sin(angle))
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .text(metric.label)
        .style("font-size", "12px");
    });

    // Create radar areas for each device
    const colors = ['#01A982', '#45B7AA', '#3DA58A', '#36967D', '#2E8570'];
    
    devices.forEach((device, deviceIndex) => {
      const data = metrics.map((metric, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const value = device[metric.key] / metric.max;
        return {
          x: radius * value * Math.cos(angle),
          y: radius * value * Math.sin(angle)
        };
      });

      const line = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveCardinalClosed);

      g.append("path")
        .datum(data)
        .attr("d", line)
        .style("fill", colors[deviceIndex % colors.length])
        .style("fill-opacity", 0.3)
        .style("stroke", colors[deviceIndex % colors.length])
        .style("stroke-width", "2px");

      // Add dots
      g.selectAll(`.dot-${deviceIndex}`)
        .data(data)
        .enter().append("circle")
        .attr("class", `dot-${deviceIndex}`)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 4)
        .style("fill", colors[deviceIndex % colors.length]);
    });

    // Add legend for radar chart
    const radarLegend = g.selectAll(".radar-legend")
      .data(devices)
      .enter().append("g")
      .attr("class", "radar-legend")
      .attr("transform", (d, i) => `translate(${-radius},${radius - 60 + i * 20})`);

    radarLegend.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", (d, i) => colors[i % colors.length]);

    radarLegend.append("text")
      .attr("x", 18)
      .attr("y", 6)
      .attr("dy", ".35em")
      .text(d => d.name.split(' ').slice(0, 2).join(' '))
      .style("font-size", "10px");
  };

  const createScatterPlot = () => {
    const svgElement = d3.select(scatterPlotRef.current);
    svgElement.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = svgElement
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(devices, d => d.price) * 1.1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(devices, d => d.score) * 1.1])
      .range([height, 0]);

    const size = d3.scaleLinear()
      .domain([0, d3.max(devices, d => d.readSpeed)])
      .range([5, 20]);

    const color = d3.scaleOrdinal()
      .domain(devices.map(d => d.type))
      .range(['#01A982', '#45B7AA', '#3DA58A', '#36967D', '#2E8570']);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("text")
      .attr("transform", `translate(${width/2}, ${height + 40})`)
      .style("text-anchor", "middle")
      .text("Price ($)");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y));

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Performance Score");

    // Dots
    g.selectAll(".dot")
      .data(devices)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.price))
      .attr("cy", d => y(d.score))
      .attr("r", d => size(d.readSpeed))
      .style("fill", d => color(d.type))
      .style("opacity", 0.7)
      .on("mouseover", function(event, d) {
        d3.select(this).style("opacity", 1);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`${d.name}<br/>Price: $${d.price}<br/>Score: ${d.score}<br/>Read Speed: ${d.readSpeed} MB/s`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 0.7);
        d3.selectAll(".tooltip").remove();
      });

    // Legend for scatter plot
    const types = [...new Set(devices.map(d => d.type))];
    const scatterLegend = g.selectAll(".scatter-legend")
      .data(types)
      .enter().append("g")
      .attr("class", "scatter-legend")
      .attr("transform", (d, i) => `translate(${width - 150}, ${20 + i * 20})`);

    scatterLegend.append("circle")
      .attr("r", 6)
      .style("fill", d => color(d));

    scatterLegend.append("text")
      .attr("x", 12)
      .attr("dy", ".35em")
      .text(d => d)
      .style("font-size", "12px");
  };

  return (
    <div className="performance-dashboard">
      <div className="charts-container">
        <div className="chart-section">
          <h3>HPE Storage Performance Comparison</h3>
          <svg ref={barChartRef}></svg>
        </div>
        
        <div className="chart-section">
          <h3>HPE Multi-Metric Analysis</h3>
          <svg ref={radarChartRef}></svg>
        </div>
        
        <div className="chart-section">
          <h3>HPE Price vs Performance Matrix</h3>
          <p className="chart-description">Bubble size represents read speed performance</p>
          <svg ref={scatterPlotRef}></svg>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
