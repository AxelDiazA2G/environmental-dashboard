import React, { useState, useEffect } from "react";
import { Thermometer, Activity, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs.tsx";
import SingleMetricChart from "./SingleMetricChart";
import CombinedEnvironmentalChart from "./CombinedEnvironmentalChart";
import ReactMarkdown from "react-markdown";

const fetchTemperatureByDay = async () => {
  const response = await fetch(
    "https://desolate-escarpment-33883-fa3df39ce07e.herokuapp.com/data/temperature/by-day"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch temperature data by day");
  }
  return response.json();
};

const fetchMotionByDay = async () => {
  const response = await fetch(
    "https://desolate-escarpment-33883-fa3df39ce07e.herokuapp.com/data/motion/by-day"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch motion data by day");
  }
  return response.json();
};

const fetchSummary = async (temperatureData, motionData) => {
  const response = await fetch(
    "https://desolate-escarpment-33883-fa3df39ce07e.herokuapp.com/summarize",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          temperature: temperatureData,
          motion: motionData,
        },
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch summary");
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
        {value !== undefined ? parseFloat(value).toFixed(1) : "N/A"} {unit}
      </div>
    </CardContent>
  </Card>
);

const SummaryCard = ({ summary }) => (
  <Card className="bg-gray-800 text-gray-100 shadow-lg rounded-lg transition col-span-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        Environmental Summary
      </CardTitle>
      <FileText className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-sm">
        <ReactMarkdown>{summary}</ReactMarkdown>
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
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      setIsLoading(true);
      try {
        const fetchedTemperatureData = await fetchTemperatureByDay();
        const fetchedMotionData = await fetchMotionByDay();

        // Convert string values to numbers
        const formattedTempData = fetchedTemperatureData.map((item) => ({
          ...item,
          average_temp: parseFloat(item.average_temp),
        }));
        const formattedMotionData = fetchedMotionData.map((item) => ({
          ...item,
          motion_count: parseInt(item.motion_count, 10),
        }));

        // Sort data by date in descending order
        const sortedTempData = formattedTempData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const sortedMotionData = formattedMotionData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setTemperatureData(sortedTempData);
        setMotionData(sortedMotionData);

        setCurrentData({
          temperature:
            sortedTempData.length > 0 ? sortedTempData[0].average_temp : 0,
          motion:
            sortedMotionData.length > 0 ? sortedMotionData[0].motion_count : 0,
        });

        // Fetch and set summary
        const summaryResponse = await fetchSummary(
          sortedTempData,
          sortedMotionData
        );
        setSummary(summaryResponse.summary);

        console.log("Temperature Data:", sortedTempData);
        console.log("Motion Data:", sortedMotionData);
        console.log("Current Data:", {
          temperature:
            sortedTempData.length > 0 ? sortedTempData[0].average_temp : 0,
          motion:
            sortedMotionData.length > 0 ? sortedMotionData[0].motion_count : 0,
        });
        console.log("Summary:", summaryResponse.summary);
      } catch (error) {
        console.error("Failed to fetch data:", error);
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

  return (
    <div className="p-8 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Environmental Dashboard by Axel Diaz</h1>
      <h2 className="text-4xl font-bold mb-4 text-center">202430 Sem in Advanced Software Dev CEN-4930C-33262</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <DataCard
          title="Average Temperature (Today)"
          value={currentData.temperature}
          icon={Thermometer}
          unit="°C"
        />
        <DataCard
          title="Motion Events (Today)"
          value={currentData.motion}
          icon={Activity}
          unit="Events"
        />
        <SummaryCard summary={summary} />
      </div>
      <Tabs defaultValue="temperature" className="bg-gray-800 text-gray-100 rounded-lg p-6">
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
          <div className="p-4 bg-gray-900 rounded-lg">
            <SingleMetricChart
              data={temperatureData}
              metric="average_temp"
              color="#ff7300"
              unit="°C"
              xAxisDataKey="date"
            />
          </div>
        </TabsContent>
        <TabsContent value="motion">
          <div className="p-4 bg-gray-900 rounded-lg">
            <SingleMetricChart
              data={motionData}
              metric="motion_count"
              color="#82ca9d"
              unit="Events"
              xAxisDataKey="date"
            />
          </div>
        </TabsContent>
        <TabsContent value="combined">
          <div className="p-4 bg-gray-900 rounded-lg">
            <CombinedEnvironmentalChart
              temperatureData={temperatureData}
              motionData={motionData}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnvironmentalDashboard;
