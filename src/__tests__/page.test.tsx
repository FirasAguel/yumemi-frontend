import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import Home from '../app/page';
import { Prefecture } from '@/types/interfaces';
import { mockPrefectures } from './__data__/prefectures.mock';

// Mock the API call
vi.mock('@/services/api', () => ({
  getPrefectures: async () => {
    return mockPrefectures;
  },
}));

// Mock ChartController to simply display how many prefectures it received.
vi.mock('@/components/ChartController', () => ({
  default: ({ prefectures }: { prefectures: Prefecture[] }) => {
    return (
      <div data-testid="chart-controller">
        ChartController with {prefectures.length} prefectures
      </div>
    );
  },
}));

test('renders Home page with header, ChartController, and footer', async () => {
  // Home is an async function; await its resolution.
  const page = await Home();
  render(page);

  // Verify the header
  const header = screen.getByRole('heading', {
    level: 1,
    name: '都道府県人口グラフ',
  });
  expect(header).toBeInTheDocument();

  // Verify the ChartController receives all prefectures
  const chartController = screen.getByTestId('chart-controller');
  expect(chartController).toHaveTextContent(
    `ChartController with ${mockPrefectures.length} prefectures`
  );
});
