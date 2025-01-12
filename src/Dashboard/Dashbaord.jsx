import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Battery, Car, DollarSign, Activity, Download } from "lucide-react";
import Papa from "papaparse";
import _ from "lodash";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Import themes
import { themes } from "../theme/theme";

// Import components
import { TabButton } from "../components/TabButton";
import { ThemeToggle } from "../components/ThemeToggle";
import { MetricCard } from "../components/MetricCard";
import {
  ChartContainer,
} from "../components/charts/ChartContainer";
import { CustomTooltip } from "../components/charts/CustomTooltip";
import { DataTable } from "../components/DataTable";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("dashboard");

  const priceRangeDistribution = _(data)
    .groupBy((item) => {
      const price = item["Base MSRP"];
      if (price <= 20000) return "≤$20k";
      if (price <= 30000) return "$20k-$30k";
      if (price <= 40000) return "$30k-$40k";
      if (price <= 50000) return "$40k-$50k";
      if (price <= 60000) return "$50k-$60k";
      if (price <= 70000) return "$60k-$70k";
      if (price <= 80000) return "$70k-$80k";
      if (price <= 90000) return "$80k-$90k";
      if (price <= 100000) return "$90k-$100k";
      if (price <= 125000) return "$100k-$125k";
      return ">$125k";
    })
    .map((group, range) => ({
      range,
      count: group.length,
    }))
    .orderBy(["range"], ["asc"])
    .value();

  const handleExportCharts = () => {
    const doc = new jsPDF("l", "mm", "a4");

    // Add title
    doc.setFontSize(16);
    doc.text("EV Population Dashboard - Charts Overview", 14, 15);

    // Add metadata
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 25);
    doc.text(`Total Vehicles: ${totalVehicles.toLocaleString()}`, 14, 30);
    doc.text(`Average Range: ${Math.round(avgRange)} miles`, 100, 30);
    doc.text(`Average MSRP: ${Math.round(avgMSRP).toLocaleString()}`, 170, 30);

    // Add statistics table
    autoTable(doc, {
      head: [["Metric", "Value"]],
      body: [
        ["Total Vehicles", totalVehicles.toLocaleString()],
        ["Average Electric Range", `${Math.round(avgRange)} miles`],
        ["Average Base MSRP", `${Math.round(avgMSRP).toLocaleString()}`],
        ["Unique Manufacturers", uniqueMakes.toString()],
      ],
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: 35 },
    });

    // Add summary text
    doc.setFontSize(10);
    doc.text("Key Insights:", 14, 80);
    doc.setFontSize(8);
    const insights = [
      `- Most popular manufacturer: ${makeDistribution[0]?.make} with ${makeDistribution[0]?.count} vehicles`,
      `- Highest average range: ${avgRangeByMake[0]?.make} with ${Math.round(
        avgRangeByMake[0]?.range
      )} miles`,
      `- Most common price range: ${
        _(priceRangeDistribution).maxBy("count")?.range
      } with ${_(priceRangeDistribution).maxBy("count")?.count} vehicles`,
    ];
    insights.forEach((insight, idx) => {
      doc.text(insight, 14, 85 + idx * 5);
    });

    doc.save("ev_dashboard_charts.pdf");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/Electric_Vehicle_Population_Data.csv");
        const csvText = await response.text();
        const result = Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        const processedData = result.data;
        setData(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${themes[theme].background}`}
      >
        <div
          className={`animate-spin rounded-full h-32 w-32 border-b-2 ${themes[theme].primary}`}
        ></div>
      </div>
    );
  }

  if (!data) {
    return <div className={themes[theme].text}>Error loading data</div>;
  }

  // Data processing for visualizations
  const makeDistribution = _(data)
    .countBy("Make")
    .map((count, make) => ({ make, count }))
    .orderBy("count", "desc")
    .take(10)
    .value();

  const evTypeDistribution = _(data)
    .countBy("Electric Vehicle Type")
    .map((value, name) => ({ name, value }))
    .value();

  const yearDistribution = _(data)
    .countBy("Model Year")
    .map((count, year) => ({ year: parseInt(year), count }))
    .orderBy("year")
    .value();

  const avgRangeByMake = _(data)
    .groupBy("Make")
    .map((group, make) => ({
      make,
      range: _.meanBy(group, "Electric Range"),
    }))
    .orderBy("range", "desc")
    .take(10)
    .value();

  const countyDistribution = _(data)
    .countBy("County")
    .map((value, name) => ({ name, value }))
    .orderBy("value", "desc")
    .take(10)
    .value();

  const modelDistribution = _(data)
    .countBy("Model")
    .map((value, name) => ({ name, value }))
    .orderBy("value", "desc")
    .take(10)
    .value();

  const totalVehicles = data.length;
  const avgRange = _.meanBy(data, "Electric Range");
  const avgMSRP = _.meanBy(data, "Base MSRP");
  const uniqueMakes = _.uniq(_.map(data, "Make")).length;

  return (
    <div
      className={`min-h-screen ${themes[theme].background} p-6 transition-colors duration-300`}
    >
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      <header className="mb-8">
        <h1 className={`text-3xl font-bold ${themes[theme].text} mb-4`}>
          EV Population Dashboard
        </h1>
        <div className="flex gap-4 mb-6">
          <TabButton
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            theme={theme}
          >
            Dashboard
          </TabButton>
          <TabButton
            active={activeTab === "data"}
            onClick={() => setActiveTab("data")}
            theme={theme}
          >
            Data Table
          </TabButton>
        </div>
      </header>

      {activeTab === "dashboard" ? (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleExportCharts}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${themes[theme].cardBg} ${themes[theme].text} ${themes[theme].hover}`}
            >
              <Download className="w-4 h-4" />
              Export All Charts
            </button>
          </div>
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={Car}
              title="Total Vehicles"
              value={totalVehicles.toLocaleString()}
              theme={theme}
            />
            <MetricCard
              icon={Battery}
              title="Avg. Electric Range"
              value={`${Math.round(avgRange)} miles`}
              theme={theme}
            />
            <MetricCard
              icon={DollarSign}
              title="Avg. Base MSRP"
              value={`$${Math.round(avgMSRP).toLocaleString()}`}
              theme={theme}
            />
            <MetricCard
              icon={Activity}
              title="Unique Manufacturers"
              value={uniqueMakes}
              theme={theme}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Manufacturer Distribution */}
            <ChartContainer title="Top 10 EV Manufacturers" theme={theme}>
              <BarChart data={makeDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="make"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <YAxis
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <Tooltip content={<CustomTooltip theme={theme} />} />
                <Bar dataKey="count" fill={themes[theme].chartColors[0]} />
              </BarChart>
            </ChartContainer>

            {/* EV Type Distribution */}
            <ChartContainer title="EV Type Distribution" theme={theme}>
              <PieChart>
                <Pie
                  data={evTypeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {evTypeDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        themes[theme].chartColors[
                          index % themes[theme].chartColors.length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>

            {/* Year Distribution */}
            <ChartContainer title="Vehicles by Model Year" theme={theme}>
              <LineChart data={yearDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="year"
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <YAxis
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <Tooltip content={<CustomTooltip theme={theme} />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={themes[theme].chartColors[4]}
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>

            {/* Average Range by Manufacturer */}
            <ChartContainer
              title="Top 10 Manufacturers by Avg. Electric Range"
              theme={theme}
            >
              <BarChart data={avgRangeByMake}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="make"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <YAxis
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <Tooltip content={<CustomTooltip theme={theme} />} />
                <Bar dataKey="range" fill={themes[theme].chartColors[1]} />
              </BarChart>
            </ChartContainer>

            {/* County Distribution */}
            <ChartContainer
              title="Top 10 Counties by EV Population"
              theme={theme}
            >
              <BarChart data={countyDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <YAxis
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <Tooltip content={<CustomTooltip theme={theme} />} />
                <Bar dataKey="value" fill={themes[theme].chartColors[2]} />
              </BarChart>
            </ChartContainer>

            {/* Model Distribution */}
            <ChartContainer title="Top 10 EV Models" theme={theme}>
              <BarChart data={modelDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <YAxis
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <Tooltip content={<CustomTooltip theme={theme} />} />
                <Bar dataKey="value" fill={themes[theme].chartColors[3]} />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Full-width price range chart */}
          <div className="w-full">
            <ChartContainer title="EVs by Price Range" theme={theme}>
              <BarChart data={priceRangeDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="range"
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <YAxis
                  tick={{
                    fill: themes[theme].text === "text-white" ? "#fff" : "#000",
                  }}
                />
                <Tooltip content={<CustomTooltip theme={theme} />} />
                <Bar dataKey="count" fill={themes[theme].chartColors[5]} />
              </BarChart>
            </ChartContainer>
          </div>
        </>
      ) : (
        <DataTable data={data} theme={theme} />
      )}
    </div>
  );
};

export default Dashboard;
