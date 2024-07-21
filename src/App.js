import React, { useState, useEffect } from "react";
import { Thermometer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs.tsx";
import SingleMetricChart from "./SingleMetricChart";
import CombinedEnvironmentalChart from "./CombinedEnvironmentalChart";
import html2canvas from "html2canvas";

// Fetch temperature data from the API
const fetchTemperatureData = async () => {
  const response = await fetch("https://desolate-escarpment-33883-fa3df39ce07e.herokuapp.com/data/temperature");
  if (!response.ok) {
    throw new Error("Failed to fetch temperature data");
  }
  return response.json();
};

// Fetch motion data from the API (you need to provide the endpoint)
const fetchMotionData = async () => {
  const response = await fetch("https://desolate-escarpment-33883-fa3df39ce07e.herokuapp.com/data/motion");
  if (!response.ok) {
    throw new Error("Failed to fetch motion data");
  }
  return response.json();
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
  const [temperatureData, setTemperatureData] = useState([]);
  const [motionData, setMotionData] = useState([]);
  const [currentData, setCurrentData] = useState({
    temperature: 0,
    motion: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      setIsLoading(true);
      try {
        const fetchedTemperatureData = await fetchTemperatureData();
        const fetchedMotionData = await fetchMotionData();
        setTemperatureData(fetchedTemperatureData);
        setMotionData(fetchedMotionData);
        setCurrentData({
          temperature: fetchedTemperatureData.length > 0 ? fetchedTemperatureData[fetchedTemperatureData.length - 1].temperature : 0,
          motion: fetchedMotionData.length > 0 ? fetchedMotionData[fetchedMotionData.length - 1].motion : 0,
        });
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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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

  return (
    <div className={`p-8 bg-gray-900 text-gray-100 min-h-screen ${theme}`}>
      <button
        onClick={toggleTheme}
        className="mb-4 p-2 bg-gray-700 text-gray-100 rounded"
      >
        Toggle Theme
      </button>
      <button
        onClick={exportChart}
        className="mb-4 p-2 bg-gray-700 text-gray-100 rounded"
      >
        Export as Image
      </button>
      <h1 className="text-4xl font-bold mb-8">Environmental Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DataCard
          title="Temperature"
          value={currentData.temperature}
          icon={Thermometer}
          unit="°C"
        />
        <DataCard
          title="Motion"
          value={currentData.motion}
          icon={Thermometer} // Placeholder icon for motion
          unit="Activity Level"
        />
      </div>
      <Tabs
        defaultValue="temperature"
        className="bg-gray-800 text-gray-100 rounded-lg p-6"
      >
        <TabsList className="border-b border-gray-700 mb-4">
          <TabsTrigger
            value="temperature"
            className="text-gray-300 hover:text-white"
          >
            Temperature
          </TabsTrigger>
          <TabsTrigger
            value="motion"
            className="text-gray-300 hover:text-white"
          >
            Motion
          </TabsTrigger>
          <TabsTrigger
            value="combined"
            className="text-gray-300 hover:text-white"
          >
            Combined
          </TabsTrigger>
        </TabsList>
        <TabsContent value="temperature">
          <SingleMetricChart
            data={temperatureData}
            metric="temperature"
            color="#ff7300"
            unit="°C"
          />
        </TabsContent>
        <TabsContent value="motion">
          <SingleMetricChart
            data={motionData}
            metric="motion"
            color="#82ca9d"
            unit="Activity Level"
          />
        </TabsContent>
        <TabsContent value="combined">
          <CombinedEnvironmentalChart temperatureData={temperatureData} motionData={motionData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnvironmentalDashboard;
