'use client';
import React, { useRef, useEffect, useState } from 'react';

interface CustomLegendItem {
  value?: string | number;
  color?: string;
  dataKey?: string | number;
  payload?: {
    legendType?: string;
  };
}

interface CustomLegendProps {
  payload?: CustomLegendItem[];
  selectedPrefectures: number[];
  getPrefectureName: (key: string | number) => string;
}

const CustomLegend = ({
  payload = [],
  selectedPrefectures,
  getPrefectureName,
}: CustomLegendProps) => {
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
  }, [scrollingDown, selectedPrefectures]);

  return (
    <div
      className="hide-scrollbar flex h-[500px] flex-wrap justify-between space-y-2 overflow-y-scroll py-50 pr-2 pl-2 lg:pr-4"
      ref={containerRef}
    >
      <div className="pointer-events-none absolute top-0 left-0 h-40 w-full bg-gradient-to-b from-white via-white/90 to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-white via-gray-300 to-white" />

      {payload
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
            {entry.value !== undefined ? getPrefectureName(entry.value) : ''}
          </div>
        ))}
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-linear-to-t from-white via-white/90 to-transparent" />
    </div>
  );
};

export default CustomLegend;
