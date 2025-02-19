import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import ChartController from '@/components/ChartController';
import { Prefecture } from '@/types/interfaces';

// Sample prefecture data for testing
const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
];

// Mock PrefectureSelector so we can simulate a population type change
vi.mock('@/components/PrefectureSelector', () => ({
  default: (props: {
    prefectures: Prefecture[];
    selectedPrefectures: number[];
    onSelectionChange: (selected: number[]) => void;
    selectedPopulationType: string;
    onPopulationTypeChange: (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => void;
  }) => (
    <div data-testid="prefecture-selector">
      {/* Render a select element to simulate changing population type */}
      <select
        data-testid="population-select"
        value={props.selectedPopulationType}
        onChange={props.onPopulationTypeChange}
      >
        <option value="総人口">総人口</option>
        <option value="年齢別人口">年齢別人口</option>
      </select>
    </div>
  ),
}));

// Mock PopulationChart to verify it receives the right props
vi.mock('@/components/PopulationChart', () => ({
  default: (props: {
    prefectures: Prefecture[];
    selectedPrefectures: number[];
    populationType: string;
  }) => (
    <div data-testid="population-chart">
      PopulationChart: {props.populationType} with{' '}
      {props.selectedPrefectures.length} selected
    </div>
  ),
}));

test('ChartController renders correctly and updates population type on change', () => {
  render(<ChartController prefectures={mockPrefectures} />);

  // Check that the header for the chart section is rendered.
  expect(screen.getByText('人口構成グラフ')).toBeInTheDocument();

  // Verify the PrefectureSelector is rendered by checking its test id.
  const prefectureSelector = screen.getByTestId('prefecture-selector');
  expect(prefectureSelector).toBeInTheDocument();

  // Verify the PopulationChart is rendered and displays initial state.
  const populationChart = screen.getByTestId('population-chart');
  expect(populationChart).toHaveTextContent('総人口');
  expect(populationChart).toHaveTextContent('0 selected');

  // Get the select element for population type change.
  const select = screen.getByTestId('population-select') as HTMLSelectElement;
  // Verify initial select value is "総人口"
  expect(select.value).toBe('総人口');

  // Simulate a change event on the select element.
  fireEvent.change(select, { target: { value: '年齢別人口' } });

  // The select should now have the new value.
  expect(select.value).toBe('年齢別人口');

  // The PopulationChart should now reflect the updated population type.
  expect(screen.getByTestId('population-chart')).toHaveTextContent(
    '年齢別人口'
  );
});
