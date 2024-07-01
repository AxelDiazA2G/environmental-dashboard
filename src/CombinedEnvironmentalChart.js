import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';

const CombinedEnvironmentalChart = ({ data }) => {
  // Preprocess data to add a "dayNight" property
  const processedData = data.map(item => ({
    ...item,
    dayNight: parseInt(item.time.split(':')[0]) >= 6 && parseInt(item.time.split(':')[0]) < 18 ? 'Day' : 'Night'
  }));

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ComposedChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        
        {/* Day/Night indicator */}
        <Area 
          type="monotone" 
          dataKey="dayNight" 
          fill="#f3f4f6" 
          stroke="#d1d5db"
          yAxisId="left"
        />
        
        {/* Temperature */}
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#ef4444" 
          yAxisId="left"
          dot={false}
        />
        
        {/* Humidity */}
        <Line 
          type="monotone" 
          dataKey="humidity" 
          stroke="#3b82f6" 
          yAxisId="left"
          dot={false}
        />
        
        {/* Light */}
        <Bar 
          dataKey="light" 
          fill="#fbbf24" 
          yAxisId="right" 
          barSize={20} 
          opacity={0.8}
        />
        
        {/* CO2 */}
        <Line 
          type="monotone" 
          dataKey="co2" 
          stroke="#10b981" 
          yAxisId="right"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CombinedEnvironmentalChart;