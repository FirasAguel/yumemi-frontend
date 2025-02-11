import { test, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CustomLegend from '@/components/CustomLegend';

afterEach(() => {
  vi.useRealTimers();
  vi.resetModules();
  vi.clearAllMocks();
});

test('renders custom legend items correctly', () => {
  // Create a sample payload, including one item with legendType 'none' (which should be excluded)
  const payload = [
    {
      value: 1,
      color: '#377eb8',
      dataKey: 'Pref-1',
      payload: { legendType: 'line' },
    },
    {
      value: 2,
      color: '#e41a1c',
      dataKey: 'Pref-2',
      payload: { legendType: 'line' },
    },
    {
      value: 3,
      color: '#4daf4a',
      dataKey: 'Pref-3',
      payload: { legendType: 'none' },
    },
  ];

  // Dummy getPrefectureName function for testing.
  const getPrefectureName = (key: string | number): string => {
    if (key === 1) return '北海道';
    if (key === 2) return '青森県';
    if (key === 3) return '岩手県';
    return String(key);
  };

  render(
    <CustomLegend
      payload={payload}
      selectedPrefectures={[1, 2, 3]}
      getPrefectureName={getPrefectureName}
    />
  );

  // Expect only the legend items with legendType !== 'none' to be rendered.
  expect(screen.getByText('北海道')).toBeInTheDocument();
  expect(screen.getByText('青森県')).toBeInTheDocument();
  expect(screen.queryByText('岩手県')).not.toBeInTheDocument();
});

test('auto scrolling stops on mouseenter and resumes on mouseleave', () => {
  // Use fake timers to control the setInterval inside the component.
  vi.useFakeTimers();
  const payload = [
    {
      value: 1,
      color: '#377eb8',
      dataKey: 'Pref-1',
      payload: { legendType: 'line' },
    },
    {
      value: 2,
      color: '#e41a1c',
      dataKey: 'Pref-2',
      payload: { legendType: 'line' },
    },
  ];
  // Provide at least 8 selected prefectures to trigger auto-scrolling.
  const selectedPrefectures = [1, 2, 3, 4, 5, 6, 7, 8];
  const getPrefectureName = (key: string | number) => `Name-${key}`;

  const { container } = render(
    <CustomLegend
      payload={payload}
      selectedPrefectures={selectedPrefectures}
      getPrefectureName={getPrefectureName}
    />
  );

  // Locate the scroll container.
  const scrollContainer = container.querySelector('.hide-scrollbar');
  if (!scrollContainer) {
    throw new Error('Scroll container not found');
  }
  // Manually define clientHeight and scrollHeight to simulate scrolling.
  Object.defineProperty(scrollContainer, 'clientHeight', {
    value: 100,
    configurable: true,
  });
  Object.defineProperty(scrollContainer, 'scrollHeight', {
    value: 200,
    configurable: true,
  });

  // Set an initial scroll position.
  scrollContainer.scrollTop = 0;

  // intervalTime is 58 - selectedPrefectures.length = 50ms in this case.
  vi.advanceTimersByTime(50);
  const scrollAfterTick = scrollContainer.scrollTop;
  expect(scrollAfterTick).toBeGreaterThan(0);

  // Simulate mouseenter to stop the auto-scroll.
  scrollContainer.dispatchEvent(new Event('mouseenter'));
  const scrollBeforeStop = scrollContainer.scrollTop;
  vi.advanceTimersByTime(100);
  expect(scrollContainer.scrollTop).toEqual(scrollBeforeStop);

  // Simulate mouseleave to resume auto-scroll.
  scrollContainer.dispatchEvent(new Event('mouseleave'));
  vi.advanceTimersByTime(50);
  expect(scrollContainer.scrollTop).toBeGreaterThan(scrollBeforeStop);

  vi.useRealTimers();
});
