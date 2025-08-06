# Storage Device Performance Dashboard

A comprehensive React.js application for comparing and analyzing storage device performance metrics using interactive D3.js visualizations.

## 🚀 Features

- **Interactive Charts**: Bar charts, radar charts, and scatter plots powered by D3.js
- **Device Comparison**: Select multiple storage devices for side-by-side comparison
- **Performance Metrics**: Analyze read/write speeds, IOPS, latency, and overall scores
- **Responsive Design**: Mobile-friendly interface that works on all screen sizes
- **Real-time Updates**: Dynamic chart updates based on device selection
- **Detailed Analytics**: Price-to-performance analysis and value recommendations

## 📊 Chart Types

### 1. Performance Comparison Bar Chart

- Compares read speed, write speed, and performance scores
- Grouped bars with color-coded metrics
- Interactive tooltips with detailed information

### 2. Multi-Metric Radar Chart

- Visualizes multiple performance dimensions simultaneously
- Overlays multiple devices for easy comparison
- Normalized scales for fair comparison across metrics

### 3. Price vs Performance Scatter Plot

- Shows correlation between price and performance score
- Bubble size represents read speed
- Color-coded by storage device type

## 🛠️ Technologies Used

- **React.js**: Frontend framework with functional components and hooks
- **D3.js**: Advanced data visualization library
- **Vite**: Fast build tool and development server
- **CSS3**: Modern styling with Grid and Flexbox
- **JavaScript ES6+**: Modern JavaScript features

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Performance-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── PerformanceDashboard.jsx    # D3.js chart components
│   ├── PerformanceDashboard.css    # Chart styling
│   ├── StorageDeviceTable.jsx      # Device data table
│   └── StorageDeviceTable.css      # Table styling
├── App.jsx                         # Main application component
├── App.css                         # Global styles
└── main.jsx                        # Application entry point
```

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:

- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🎨 Customization

### Adding New Storage Devices

Edit the `mockStorageData` array in `App.jsx`:

```javascript
{
  id: 6,
  name: "Your Storage Device",
  type: "NVMe SSD",
  capacity: "2TB",
  readSpeed: 7500,
  writeSpeed: 6000,
  iops: 1200000,
  latency: 0.08,
  price: 200,
  score: 98
}
```

### Customizing Chart Colors

Modify the color schemes in `PerformanceDashboard.jsx`:

```javascript
const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📈 Performance Metrics Explained

- **Read Speed**: Sequential read performance in MB/s
- **Write Speed**: Sequential write performance in MB/s
- **IOPS**: Random Input/Output Operations Per Second
- **Latency**: Average access time in milliseconds
- **Performance Score**: Overall score from 0-100 based on all metrics
- **Price/GB**: Cost efficiency metric

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- D3.js community for excellent documentation and examples
- React team for the amazing framework
- Vite team for the lightning-fast build tool+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
