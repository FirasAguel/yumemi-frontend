'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { PopulationChartProps } from '@/types/interfaces';

export default function PopulationChart({
  populationData,
}: PopulationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={populationData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />

        {Object.keys(populationData[0])
          .filter((key) => key !== 'year')
          .map((prefCode) => (
            <Line
              key={prefCode}
              type="monotone"
              dataKey={prefCode}
              stroke="#8884d8"
            />
          ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
