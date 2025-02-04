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

import { usePopulationData } from '@/hooks/usePopulationData';
import { PopulationChartProps } from '@/types/interfaces';

export default function PopulationChart({
  populationData,
  boundaryYears,
}: PopulationChartProps) {
  const { data, isLoading, isError } = usePopulationData(1); // Example for Pref-1

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;

  const chartData = data?.populationData || populationData;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(chartData[0])
          .filter((key) => key !== 'year')
          .flatMap((prefCode) => {
            const solidData = [];
            const dashedData = [];
            // assumes populationData is sorted by year in ascending order
            for (const entry of chartData) {
              if (entry.year < boundaryYears[prefCode]) {
                solidData.push(entry);
              } else if (entry.year > boundaryYears[prefCode]) {
                dashedData.push(entry);
              } else {
                solidData.push(entry);
                dashedData.push(entry);
              }
            }
            return [
              <Line
                key={`${prefCode}-solid`}
                type="monotone"
                dataKey={prefCode}
                data={solidData}
                stroke="#8884d8"
                strokeDasharray="0"
                isAnimationActive={false}
                dot={false}
                activeDot={false}
              />,
              <Line
                key={`${prefCode}-dashed`}
                type="monotone"
                dataKey={prefCode}
                data={dashedData}
                stroke="#8884d8"
                strokeDasharray="3 3"
                legendType="none"
                isAnimationActive={true}
                tooltipType="none"
                dot={false}
                activeDot={false}
              />,
            ];
          })}
      </LineChart>
    </ResponsiveContainer>
  );
}
