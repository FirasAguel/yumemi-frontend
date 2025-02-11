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
import { Prefecture } from '@/types/interfaces';
import CustomLegend from './CustomLegend';

export default function PopulationChart({
  prefectures,
  selectedPrefectures,
  populationType,
}: {
  prefectures: Prefecture[];
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

  // getPrefectureName now accepts a non-undefined key.
  const getPrefectureName = (key: string | number): string => {
    if (typeof key === 'number') {
      const pref = prefectures.find((p) => p.prefCode === key);
      return pref ? pref.prefName : String(key);
    }
    // Assume the key is in the format 'Pref-<code>'
    const code = parseInt(key.replace('Pref-', ''), 10);
    const pref = prefectures.find((p) => p.prefCode === code);
    return pref ? pref.prefName : key;
  };

  // Format Y-axis ticks.
  const formatYAxis = (tick: number): string =>
    tick > 10000 ? (tick / 10000).toString() + '万' : tick.toString();

  // Define the style type for the legend wrapper.
  interface LegendWrapperStyle {
    position: 'absolute';
    maxWidth: string;
    minHeight: string;
    right: number;
    top: string;
    transform: string;
    textAlign: 'left' | 'center' | 'right';
  }

  const legendHeight = 500;
  const legendWrapperStyle: LegendWrapperStyle = {
    position: 'absolute',
    maxWidth: '120px',
    minHeight: `${legendHeight}px`,
    right: 0,
    top: `${legendHeight / 2}px`,
    transform: 'translateY(-50%)',
    textAlign: 'left',
  };

  const getLegendProps = () => ({
    content: (
      <CustomLegend
        selectedPrefectures={selectedPrefectures}
        getPrefectureName={getPrefectureName}
      />
    ),
    height: 1,
    wrapperStyle: legendWrapperStyle,
  });

  const colorPalette = [
    '#377eb8', // Blue
    '#e41a1c', // Red
    '#4daf4a', // Green
    '#ff7f00', // Orange
    '#984ea3', // Purple
    '#a65628', // Brown
    '#f781bf', // Pink
    '#999999', // Gray
    '#66c2a5', // Teal
    '#fc8d62', // Coral
  ];

  const getColor = (index: number) => colorPalette[index % colorPalette.length];

  // Helper to render all Line elements.
  const renderChartLines = () => {
    return Object.keys(populationData[0] || {})
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
        const color = getColor(
          selectedPrefectures.indexOf(parseInt(prefCode.replace('Pref-', '')))
        );
        return [
          <Line
            key={`${prefCode}-solid`}
            type="monotone"
            dataKey={prefCode}
            data={solidData}
            stroke={color}
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
            stroke={color}
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
      });
  };

  return (
    <>
      {/*md: or higher*/}
      <ResponsiveContainer
        width="100%"
        height={500}
        className="hidden md:block"
      >
        <LineChart
          data={populationData}
          margin={{ top: 20, right: 128, left: 0, bottom: -legendHeight }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip
            formatter={(value, name) => [value, getPrefectureName(name)]}
          />
          <Legend {...getLegendProps()} />
          {renderChartLines()}
        </LineChart>
      </ResponsiveContainer>
      {/*lower than md*/}
      <ResponsiveContainer
        width="100%"
        height={500}
        className="block md:hidden"
      >
        <LineChart
          data={populationData}
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip
            formatter={(value, name) => [value, getPrefectureName(name)]}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '10px',
            }}
            formatter={(value) => [getPrefectureName(value)]}
          />
          {renderChartLines()}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
