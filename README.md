# EV Population Dashboard 🚗⚡

A comprehensive React-based dashboard for visualizing Electric Vehicle (EV) population data. This interactive dashboard provides insights into EV adoption trends, including manufacturer distributions, price ranges, and geographic concentration.


## 🌟 Features

### Interactive Dashboard
- Real-time data visualization with responsive charts
- Dark/Light theme support
- Comprehensive metrics overview
- Interactive data filtering and sorting
- Export capabilities for both data and visualizations

### Charts & Visualizations
1. **Manufacturer Distribution**
   - Top 10 EV manufacturers by volume
   - Interactive bar chart with hover details

2. **EV Type Distribution**
   - Pie chart showing distribution of EV types
   - Color-coded segments with legend

3. **Model Year Trends**
   - Line chart showing vehicle distribution by year
   - Trend analysis with interactive tooltips

4. **Range Analysis**
   - Top 10 manufacturers by average electric range
   - Comparative bar chart with detailed metrics

5. **Geographic Distribution**
   - County-wise EV population distribution
   - Top 10 counties visualization

6. **Price Range Analysis**
   - Distribution of vehicles across price brackets
   - Comprehensive price range breakdown

### Data Management
- Advanced data table with sorting capabilities
- Full-text search functionality
- Pagination for large datasets
- Export options (CSV, PDF)

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ev-population-dashboard.git
cd ev-population-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Theming

The dashboard supports two themes:
- **Light Theme**: Optimized for daytime usage
- **Dark Theme**: Enhanced visibility in low-light conditions

Theme toggle is available via the sun/moon icon in the top-right corner.

### Theme Properties
```javascript
themes: {
  light: {
    background: "bg-gray-100",
    cardBg: "bg-white",
    text: "text-gray-900",
    // ... other properties
  },
  dark: {
    background: "bg-gray-900",
    cardBg: "bg-gray-800",
    text: "text-white",
    // ... other properties
  }
}
```

## 📊 Charts & Components

### Available Charts
1. **BarChart**: Used for discrete comparisons
2. **PieChart**: For proportion visualization
3. **LineChart**: Temporal trends and progressions

### Core Components
- `MetricCard`: Display key statistics
- `ChartContainer`: Wrapper for chart visualizations
- `DataTable`: Interactive data grid
- `CustomTooltip`: Enhanced hover information
- `ThemeToggle`: Theme switching functionality

## 💾 Export Features

### Data Export
- **CSV Export**: Raw data export with current filters
- **PDF Export**: Formatted report with charts and metrics

### Chart Export
- Comprehensive PDF export of all visualizations
- Individual chart exports
- Custom formatting and layout

## 🔧 Configuration

### Data Processing
The dashboard uses several libraries for data manipulation:
- **Papa Parse**: CSV parsing
- **Lodash**: Data transformation
- **Recharts**: Chart rendering

### Styling
- Tailwind CSS for utility-first styling
- Custom theme configuration
- Responsive design principles

## 🌐 Deployment


Live Demo: [https://ev-population-dashboard.demo.com](https://ev-population-dashboard.demo.com)

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)





