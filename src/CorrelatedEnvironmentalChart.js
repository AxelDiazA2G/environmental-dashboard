import React, { useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ReferenceArea
} from 'recharts';

const CorrelatedEnvironmentalChart = ({ data }) => {
  const [focusBar, setFocusBar] = useState(null);

  const avgTemperature = data.reduce((sum, item) => sum + item.temperature, 0) / data.length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-4 rounded shadow-lg border border-gray-200">
          <p className="label font-bold">{`Time: ${label}`}</p>
          {payload.map((pld) => (
            <p key={pld.name} style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value.toFixed(2)} ${pld.unit}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 80, bottom: 20, left: 20 }}
        onMouseMove={(state) => {
          if (state.isTooltipActive) {
            setFocusBar(state.activeTooltipIndex);
          } else {
            setFocusBar(null);
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
        <XAxis
          dataKey="time"
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#9ca3af' }}
          label={{ value: "Time", position: "insideBottomRight", offset: 0, fill: '#4b5563' }}
        />
        <YAxis
          yAxisId="left"
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#9ca3af' }}
          label={{ value: "Temperature (°C) / Humidity (%)", angle: -90, position: "insideLeft", fill: '#4b5563' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#6b7280"
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#9ca3af' }}
          label={{ value: "Light (lux) / CO2 (ppm)", angle: 90, position: "insideRight", fill: '#4b5563' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />

        <ReferenceLine
          yAxisId="left"
          y={avgTemperature}
          label={{ value: "Avg Temp", fill: '#ef4444', fontWeight: 'bold' }}
          stroke="#ef4444"
          strokeDasharray="3 3"
        />

        <Line
          yAxisId="left"
          type="monotone"
          dataKey="temperature"
          stroke="#f97316"
          strokeWidth={2}
          dot={false}
          name="Temperature"
          unit="°C"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="humidity"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          name="Humidity"
          unit="%"
        />
        <Bar
          yAxisId="right"
          dataKey="light"
          fill="#fbbf24"
          maxBarSize={20}
          name="Light"
          unit="lux"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="co2"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          name="CO2"
          unit="ppm"
        />

        {data.map((entry, index) => (
          <ReferenceArea
            key={`rf${index}`}
            yAxisId="left"
            x1={entry.time}
            x2={entry.time}
            y1={0}
            y2={entry.temperature}
            ifOverflow="extendDomain"
            fill={index === focusBar ? "rgba(249, 115, 22, 0.3)" : "transparent"}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CorrelatedEnvironmentalChart;
