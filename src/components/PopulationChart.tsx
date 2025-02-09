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
    const containerRef = useRef(null);
    const [scrollingDown, setScrollingDown] = useState(true);

    useEffect(() => {
      const scrollContainer = containerRef.current;
      if (!scrollContainer) return;

      if (selectedPrefectures.length < 8) return;

      const scrollStep = 1;
      const intervalTime = 58 - selectedPrefectures.length;
      let interval;

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
        className="space-y-2 flex flex-wrap justify-between px-3 overflow-y-scroll hide-scrollbar h-[500px] py-50 pl-2"
        ref={containerRef}
      >
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white via-white/90 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-white via-gray-300 to-white pointer-events-none" />
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

  const formatYAxis = (tick) => {
    return tick > 10000 ? (tick / 10000).toString() + '万' : tick;
  };

  const getLegendProps = () => {
    return {
      content: <CustomLegend />,
      height: 1,
      wrapperStyle: {
        position: 'absolute',
        maxWidth: '100px',
        minHeight: `${legendHeight}px`,
        right: 0,
        top: `${legendHeight / 2}px`,
        transform: 'translateY(-50%)',
        textAlign: 'left',
      },
    };
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
          margin={{ top: 20, right: 120, left: 0, bottom: -legendHeight }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} />
          <YAxis tickFormatter={(tick) => formatYAxis(tick)} />
          <Tooltip />
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
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '10px',
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
    </>
  );
}
