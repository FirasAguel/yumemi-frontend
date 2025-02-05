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

export default function PopulationChart({
  selectedPrefectures,
}: {
  selectedPrefectures: number[];
}) {
  const { data, isLoading, isError } = usePopulationData(selectedPrefectures);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;

  const populationData = data?.populationData || [];
  const boundaryYears = data?.boundaryYears || {};

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={populationData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(populationData[0] || {})
          .filter((key) => key !== 'year')
          .flatMap((prefCode) => {
            const solidData = [];
            const dashedData = [];
            for (const entry of populationData) {
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
