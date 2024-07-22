import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CombinedEnvironmentalChart = ({ temperatureData, motionData }) => {
  // Combine temperature and motion data
  const combinedData = temperatureData.map(tempItem => {
    // Find corresponding motion data
    const motionItem = motionData.find(motionItem => motionItem.date === tempItem.date);
    return {
      date: tempItem.date,
      temperature: parseFloat(tempItem.average_temp), // Use correct key from data
      motion: motionItem ? parseInt(motionItem.motion_count, 10) : 0 // Ensure correct parsing
    };
  });

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ComposedChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          angle={-45}
          textAnchor="end"
          height={70}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          yAxisId="left" 
          label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          label={{ value: 'Motion Events', angle: 90, position: 'insideRight' }}
        />
        <Tooltip />
        <Legend />
        
        {/* Temperature */}
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#ef4444" 
          yAxisId="left"
          dot={false}
          name="Temperature"
        />
        
        {/* Motion */}
        <Bar 
          dataKey="motion" 
          fill="#3b82f6" 
          yAxisId="right" 
          barSize={20} 
          opacity={0.8}
          name="Motion Events"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CombinedEnvironmentalChart;
