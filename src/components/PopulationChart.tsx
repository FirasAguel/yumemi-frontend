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
import { useRef, useEffect, useState } from 'react';
import { Prefecture } from '@/types/interfaces';

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

  // Define our custom legend item type.
  interface CustomLegendItem {
    value?: string | number;
    color?: string;
    dataKey?: string | number;
    payload?: {
      legendType?: string;
    };
  }

  // Define the props that our custom legend expects.
  interface CustomLegendProps {
    payload?: CustomLegendItem[];
  }

  // Our custom legend component.
  const CustomLegend = (props: CustomLegendProps) => {
    const { payload = [] } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollingDown, setScrollingDown] = useState(true);

    useEffect(() => {
      const scrollContainer = containerRef.current;
      if (!scrollContainer) return;

      if (selectedPrefectures.length < 8) return;

      const scrollStep = 1;
      const intervalTime = 58 - selectedPrefectures.length;
      let interval: ReturnType<typeof setInterval>;

      const startScrolling = () => {
        interval = setInterval(() => {
          if (scrollingDown) {
            scrollContainer.scrollTop += scrollStep;
            if (
              scrollContainer.scrollTop + scrollContainer.clientHeight >=
              scrollContainer.scrollHeight
            ) {
              setScrollingDown(false);
            }
          } else {
            scrollContainer.scrollTop -= scrollStep;
            if (scrollContainer.scrollTop <= 0) {
              setScrollingDown(true);
            }
          }
        }, intervalTime);
      };

      startScrolling();

      const stopAutoScroll = () => {
        clearInterval(interval);
      };

      scrollContainer.addEventListener('mouseenter', stopAutoScroll);
      scrollContainer.addEventListener('mouseleave', startScrolling);

      return () => {
        scrollContainer.removeEventListener('mouseenter', stopAutoScroll);
        scrollContainer.removeEventListener('mouseleave', startScrolling);
        stopAutoScroll();
      };
    }, [scrollingDown]);

    return (
      <div
        className="hide-scrollbar flex h-[500px] flex-wrap justify-between space-y-2 overflow-y-scroll py-50 pr-2 pl-2 lg:pr-4"
        ref={containerRef}
      >
        <div className="pointer-events-none absolute top-0 left-0 h-40 w-full bg-gradient-to-b from-white via-white/90 to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-white via-gray-300 to-white" />
        {payload
          // Check that payload exists before accessing legendType.
          .filter((entry: CustomLegendItem) =>
            entry.payload ? entry.payload.legendType !== 'none' : false
          )
          .map((entry: CustomLegendItem) => (
            <div
              key={`item-${entry.value}`}
              className="flex min-w-25 items-center text-lg"
            >
              <span
                className="mr-0.5 inline-block h-0.5 w-3"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span
                className="mr-0.5 inline-block h-0.5 w-0.5"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span
                className="mr-2 inline-block h-0.5 w-0.5"
                style={{ backgroundColor: entry.color }}
              ></span>
              {getPrefectureName(entry.value)}
            </div>
          ))}
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-linear-to-t from-white via-white/90 to-transparent" />
      </div>
    );
  };
  const legendHeight = 500;

  // Ensure tick formatter always returns a string.
  const formatYAxis = (tick: number): string => {
    return tick > 10000 ? (tick / 10000).toString() + '万' : tick.toString();
  };

  // Define the style type for the legend wrapper, using a literal union for textAlign.
  interface LegendWrapperStyle {
    position: 'absolute';
    maxWidth: string;
    minHeight: string;
    right: number;
    top: string;
    transform: string;
    textAlign: 'left' | 'center' | 'right';
  }

  const legendWrapperStyle: LegendWrapperStyle = {
    position: 'absolute',
    maxWidth: '120px',
    minHeight: `${legendHeight}px`,
    right: 0,
    top: `${legendHeight / 2}px`,
    transform: 'translateY(-50%)',
    textAlign: 'left',
  };

  const getLegendProps = () => {
    return {
      content: <CustomLegend />,
      height: 1,
      wrapperStyle: legendWrapperStyle,
    };
  };

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
          <YAxis tickFormatter={(tick) => formatYAxis(tick)} />
          <Tooltip
            formatter={(value, name) => [value, getPrefectureName(name)]}
          />
          <Legend {...getLegendProps()} />
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
                  stroke={getColor(
                    selectedPrefectures.indexOf(
                      parseInt(prefCode.replace('Pref-', ''))
                    )
                  )}
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
                  stroke={getColor(
                    selectedPrefectures.indexOf(
                      parseInt(prefCode.replace('Pref-', ''))
                    )
                  )}
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
          <YAxis tickFormatter={(tick) => formatYAxis(tick)} />
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
                  stroke={getColor(
                    selectedPrefectures.indexOf(
                      parseInt(prefCode.replace('Pref-', ''))
                    )
                  )}
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
                  stroke={getColor(
                    selectedPrefectures.indexOf(
                      parseInt(prefCode.replace('Pref-', ''))
                    )
                  )}
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
    </>
  );
}
