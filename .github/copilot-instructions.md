# Copilot Instructions for Storage Device Performance Dashboard

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a React.js application that provides a comprehensive dashboard for comparing storage device performance metrics. The project uses D3.js for advanced data visualizations and charts.

## Key Technologies

- **React.js**: Frontend framework using functional components and hooks
- **D3.js**: Data visualization library for creating interactive charts
- **Vite**: Build tool for fast development and optimized production builds
- **CSS3**: Modern styling with Grid, Flexbox, and gradients

## Project Structure

- `/src/App.jsx`: Main application component with mock data and state management
- `/src/components/PerformanceDashboard.jsx`: D3.js chart components (bar, radar, scatter plots)
- `/src/components/StorageDeviceTable.jsx`: Interactive data table with device selection
- `/src/components/*.css`: Component-specific styling

## Data Structure

Storage devices have the following properties:

- `id`: Unique identifier
- `name`: Device name
- `type`: Storage type (NVMe SSD, SATA SSD, HDD, Optane SSD)
- `capacity`: Storage capacity
- `readSpeed`: Read speed in MB/s
- `writeSpeed`: Write speed in MB/s
- `iops`: Input/Output operations per second
- `latency`: Access latency in milliseconds
- `price`: Price in USD
- `score`: Overall performance score (0-100)

## Chart Types

1. **Bar Chart**: Compares read speed, write speed, and performance scores
2. **Radar Chart**: Multi-dimensional analysis of device capabilities
3. **Scatter Plot**: Price vs performance correlation with bubble size for read speed

## Coding Guidelines

- Use functional components with React hooks (useState, useEffect, useRef)
- Follow D3.js best practices: select, bind data, enter/update/exit pattern
- Implement responsive design for mobile compatibility
- Use semantic HTML and accessible components
- Include hover interactions and tooltips for better UX
- Maintain consistent color schemes across charts
- Handle device selection state management efficiently

## Performance Considerations

- Optimize D3.js re-renders by clearing SVG elements before redrawing
- Use useEffect dependencies properly to prevent unnecessary chart updates
- Implement proper cleanup for D3.js event listeners
- Consider virtualization for large datasets in the table component

## Future Enhancements

- Add real-time data fetching from APIs
- Implement data export functionality (CSV, PDF)
- Add more chart types (line charts for historical data)
- Include advanced filtering and sorting options
- Add device comparison recommendations based on use cases
