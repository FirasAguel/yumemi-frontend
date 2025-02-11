import { test, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Prefecture } from '@/types/interfaces';

const samplePrefectures: Prefecture[] = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
];

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

// Test for loading state
test('renders loading state', async () => {
  vi.doMock('@/hooks/usePopulationData', () => ({
    usePopulationData: () => ({
      data: { populationData: [] },
      isLoading: true,
      isError: false,
    }),
  }));

  const { default: PopulationChart } = await import(
    '@/components/PopulationChart'
  );
  render(
    <PopulationChart
      prefectures={samplePrefectures}
      selectedPrefectures={[1, 2]}
      populationType="総人口"
    />
  );
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
});

// Test for error state
test('renders error state', async () => {
  vi.doMock('@/hooks/usePopulationData', () => ({
    usePopulationData: () => ({
      data: null,
      isLoading: false,
      isError: true,
    }),
  }));

  const { default: PopulationChart } = await import(
    '@/components/PopulationChart'
  );
  render(
    <PopulationChart
      prefectures={samplePrefectures}
      selectedPrefectures={[1, 2]}
      populationType="総人口"
    />
  );
  expect(screen.getByText(/Error loading data/i)).toBeInTheDocument();
});

// Test for successful data rendering and custom legend integration
test('renders chart when data is available', async () => {
  vi.doMock('@/hooks/usePopulationData', () => ({
    usePopulationData: () => ({
      data: {
        // Data with two prefecture keys; boundaries set after the entry year.
        populationData: [{ year: 2000, 'Pref-1': 1000, 'Pref-2': 2000 }],
        boundaryYears: { 'Pref-1': 2005, 'Pref-2': 2005 },
      },
      isLoading: false,
      isError: false,
    }),
  }));

  const { default: PopulationChart } = await import(
    '@/components/PopulationChart'
  );
  render(
    <PopulationChart
      prefectures={samplePrefectures}
      selectedPrefectures={[1, 2]}
      populationType="総人口"
    />
  );

  // Ensure that neither loading nor error state is present.
  await waitFor(() => {
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Error loading data/i)).not.toBeInTheDocument();
  });

  // Check that at least one Recharts responsive container is rendered.
  expect(
    document.querySelector('.recharts-responsive-container')
  ).toBeInTheDocument();
});

// Test to verify that both desktop and mobile ResponsiveContainers are rendered.
test('renders desktop and mobile ResponsiveContainers with correct class names', async () => {
  vi.doMock('@/hooks/usePopulationData', () => ({
    usePopulationData: () => ({
      data: {
        populationData: [{ year: 2000, 'Pref-1': 1000, 'Pref-2': 2000 }],
        boundaryYears: { 'Pref-1': 2005, 'Pref-2': 2005 },
      },
      isLoading: false,
      isError: false,
    }),
  }));

  const { default: PopulationChart } = await import(
    '@/components/PopulationChart'
  );
  const { container } = render(
    <PopulationChart
      prefectures={samplePrefectures}
      selectedPrefectures={[1, 2]}
      populationType="総人口"
    />
  );

  // The desktop container should have "hidden md:block" and the mobile container "block md:hidden".
  const desktopContainer = container.querySelector('.hidden.md\\:block');
  const mobileContainer = container.querySelector('.block.md\\:hidden');

  expect(desktopContainer).toBeInTheDocument();
  expect(mobileContainer).toBeInTheDocument();
});
