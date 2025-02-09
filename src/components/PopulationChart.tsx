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
  populationType,
}: {
  selectedPrefectures: number[];
  populationType: string;
}) {
  const { data, isLoading, isError } = usePopulationData(
    selectedPrefectures,
    populationType
  );

  if (isLoading && (!data || data.populationData.length === 0))
    return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;

  const populationData = data?.populationData || [];
  const boundaryYears = data?.boundaryYears || {};

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div className="space-y-2 flex flex-wrap justify-between px-3 overflow-y-scroll hide-scrollbar h-[500px] py-60">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white via-white/90 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-white via-gray-400 to-white pointer-events-none" />
        {payload
          .filter((entry) => entry.payload.legendType !== 'none')
          .map((entry, index) => (
            <div
              key={`item-${entry.value}`}
              className="flex items-center text-sm w-20"
            >
              <span
                className="inline-block w-3 h-0.5 mr-0.5"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span
                className="inline-block w-0.5 h-0.5 mr-0.5"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span
                className="inline-block w-0.5 h-0.5 mr-2"
                style={{ backgroundColor: entry.color }}
              ></span>
              {entry.value}
            </div>
          ))}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-white via-white/90 to-transparent pointer-events-none" />
      </div>
    );
  };
  const legendHeight = 500;
  const legendWidth = 160;

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={populationData}
        margin={{ top: 20, right: 120, left: 20, bottom: -legendHeight }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} />
        <YAxis />
        <Tooltip />
        <Legend
          content={<CustomLegend />}
          height={1}
          wrapperStyle={{
            position: 'absolute',
            maxWidth: '100px',
            minHeight: `${legendHeight}px`,
            right: 0,
            top: `${legendHeight / 2}px`,
            transform: 'translateY(-50%)',
            textAlign: 'left',
          }}
        />
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
            const duration = Math.random() * 600 + 900;
            return [
              <Line
                key={`${prefCode}-solid`}
                type="monotone"
                dataKey={prefCode}
                data={solidData}
                stroke="#8884d8"
                strokeDasharray="0"
                isAnimationActive={true}
                animationDuration={duration}
                animationEasing="linear"
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
                animationBegin={duration}
                animationEasing="linear"
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
