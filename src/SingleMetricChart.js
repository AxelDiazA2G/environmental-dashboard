import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SingleMetricChart = ({ data, metric, color, unit }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis label={{ value: unit, angle: -90, position: 'insideLeft' }} />
        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} />
        <Legend />
        <Line type="monotone" dataKey={metric} stroke={color} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SingleMetricChart;