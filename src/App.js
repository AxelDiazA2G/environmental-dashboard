import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Sun, Droplets, Thermometer, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs.tsx";
import CombinedEnvironmentalChart from "./CombinedEnvironmentalChart";
import CorrelatedEnvironmentalChart from './CorrelatedEnvironmentalChart';
import SingleMetricChart from './SingleMetricChart';
import html2canvas from 'html2canvas';

const fetchData = () => {
  const baseTemperature = 28; // Base temperature in Celsius for summer in Orlando
  const baseHumidity = 70; // Base humidity percentage in summer
  const baseCO2 = 400; // Base CO2 level in ppm

  return Array(24).fill().map((_, i) => {
    const hour = i;
    const isDaytime = hour >= 6 && hour < 18;

    const temperatureVariation = Math.sin(((hour - 5) * Math.PI) / 12) * 10; // Greater variation
    const temperature = baseTemperature + temperatureVariation + (Math.random() - 0.5) * 2;

    const humidityVariation = -Math.sin(((hour - 5) * Math.PI) / 12) * 20; // Greater variation
    const humidity = baseHumidity + humidityVariation + (Math.random() - 0.5) * 5;

    let light;
    if (isDaytime) {
      light = Math.sin(((hour - 6) * Math.PI) / 12) * 1000 + 200 + Math.random() * 100;
    } else {
      light = Math.random() * 10; // Moonlight and artificial light
    }

    const co2Variation = isDaytime ? 150 : 75; // More significant variation
    const co2 = baseCO2 + co2Variation + (Math.random() - 0.5) * 30;

    return {
      time: `${String(hour).padStart(2, "0")}:00`,
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
      light: Math.round(light),
      co2: Math.round(co2),
    };
  });
};

const DataCard = ({ title, value, icon: Icon, unit }) => (
  <Card className="bg-gray-800 text-gray-100 shadow-lg rounded-lg transition">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {value !== undefined ? value.toFixed(1) : "N/A"} {unit}
      </div>
    </CardContent>
  </Card>
);

const EnvironmentalDashboard = () => {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState({
    temperature: 0,
    humidity: 0,
    light: 0,
    co2: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      setIsLoading(true);
      try {
        const fetchedData = await fetchData(); // Assume this becomes an async call in the future
        setData(fetchedData);
        setCurrentData(fetchedData[fetchedData.length - 1]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error state here
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndSetState();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handlePointClick = (data) => {
    alert(`You clicked on: ${JSON.stringify(data)}`);
  };

  const exportChart = () => {
    const chart = document.getElementById("chart");
    html2canvas(chart).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "chart.png";
      link.click();
    });
  };

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff7300" strokeWidth={2} dot={{ onClick: handlePointClick }} name="Temperature" unit="°C" />
              <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#8884d8" strokeWidth={2} dot={{ onClick: handlePointClick }} name="Humidity" unit="%" />
              <Bar yAxisId="right" dataKey="light" fill="#ffc658" maxBarSize={20} name="Light" unit="lux" />
              <Line yAxisId="right" type="monotone" dataKey="co2" stroke="#82ca9d" strokeWidth={2} dot={{ onClick: handlePointClick }} name="CO2" unit="ppm" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="temperature" fill="#ff7300" name="Temperature" unit="°C" />
              <Bar yAxisId="left" dataKey="humidity" fill="#8884d8" name="Humidity" unit="%" />
              <Bar yAxisId="right" dataKey="light" fill="#ffc658" maxBarSize={20} name="Light" unit="lux" />
              <Bar yAxisId="right" dataKey="co2" fill="#82ca9d" name="CO2" unit="ppm" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff7300" strokeWidth={2} dot={{ onClick: handlePointClick }} name="Temperature" unit="°C" />
              <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#8884d8" strokeWidth={2} dot={{ onClick: handlePointClick }} name="Humidity" unit="%" />
              <Bar yAxisId="right" dataKey="light" fill="#ffc658" maxBarSize={20} name="Light" unit="lux" />
              <Line yAxisId="right" type="monotone" dataKey="co2" stroke="#82ca9d" strokeWidth={2} dot={{ onClick: handlePointClick }} name="CO2" unit="ppm" />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className={`p-8 bg-gray-900 text-gray-100 min-h-screen ${theme}`}>
      <button onClick={toggleTheme} className="mb-4 p-2 bg-gray-700 text-gray-100 rounded">Toggle Theme</button>
      <button onClick={exportChart} className="mb-4 p-2 bg-gray-700 text-gray-100 rounded">Export as Image</button>
      <h1 className="text-4xl font-bold mb-8">
        Environmental Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DataCard
          title="Temperature"
          value={currentData.temperature}
          icon={Thermometer}
          unit="°C"
        />
        <DataCard
          title="Humidity"
          value={currentData.humidity}
          icon={Droplets}
          unit="%"
        />
        <DataCard
          title="Light"
          value={currentData.light}
          icon={Sun}
          unit="lux"
        />
        <DataCard 
          title="CO2" 
          value={currentData.co2} 
          icon={Wind} 
          unit="ppm" 
        />
      </div>
      <div className="mb-4">
        <button onClick={() => setChartType("line")} className="p-2 bg-gray-700 text-gray-100 rounded">Line Chart</button>
        <button onClick={() => setChartType("bar")} className="p-2 bg-gray-700 text-gray-100 rounded">Bar Chart</button>
      </div>
      <Tabs
        defaultValue="correlated"
        className="bg-gray-800 text-gray-100 rounded-lg p-6"
      >
        <TabsList className="border-b border-gray-700 mb-4">
          <TabsTrigger value="correlated" className="text-gray-300 hover:text-white">Correlated</TabsTrigger>
          <TabsTrigger value="temperature" className="text-gray-300 hover:text-white">Temperature</TabsTrigger>
          <TabsTrigger value="humidity" className="text-gray-300 hover:text-white">Humidity</TabsTrigger>
          <TabsTrigger value="light" className="text-gray-300 hover:text-white">Light</TabsTrigger>
          <TabsTrigger value="co2" className="text-gray-300 hover:text-white">CO2</TabsTrigger>
          <TabsTrigger value="combined" className="text-gray-300 hover:text-white">Combined</TabsTrigger>
        </TabsList>
        <TabsContent value="correlated">
          <CorrelatedEnvironmentalChart data={data} />
        </TabsContent>
        <TabsContent value="temperature">
          <SingleMetricChart data={data} metric="temperature" color="#ff7300" unit="°C" />
        </TabsContent>
        <TabsContent value="humidity">
          <SingleMetricChart data={data} metric="humidity" color="#8884d8" unit="%" />
        </TabsContent>
        <TabsContent value="light">
          <SingleMetricChart data={data} metric="light" color="#ffc658" unit="lux" />
        </TabsContent>
        <TabsContent value="co2">
          <SingleMetricChart data={data} metric="co2" color="#82ca9d" unit="ppm" />
        </TabsContent>
        <TabsContent value="combined">
          <CombinedEnvironmentalChart data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnvironmentalDashboard;
