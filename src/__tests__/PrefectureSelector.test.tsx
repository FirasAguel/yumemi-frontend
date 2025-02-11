import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import PrefectureSelector from '@/components/PrefectureSelector';
import { Prefecture } from '@/types/interfaces';

// Create some sample prefecture data for testing.
const mockPrefectures: Prefecture[] = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
  { prefCode: 3, prefName: '岩手県' },
];

test('renders PrefectureSelector with buttons, select, and checkboxes', () => {
  const onSelectionChange = vi.fn();
  const onPopulationTypeChange = vi.fn();

  render(
    <PrefectureSelector
      prefectures={mockPrefectures}
      selectedPrefectures={[]}
      onSelectionChange={onSelectionChange}
      selectedPopulationType="総人口"
      onPopulationTypeChange={onPopulationTypeChange}
    />
  );

  // Verify the "Select All" and "Deselect All" buttons exist.
  expect(
    screen.getByRole('button', { name: /^Select All$/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /Deselect All/i })
  ).toBeInTheDocument();

  // Verify the select element and its options.
  const select = screen.getByRole('combobox');
  expect(select).toBeInTheDocument();
  expect(select).toHaveValue('総人口');
  expect(screen.getByRole('option', { name: '総人口' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '年少人口' })).toBeInTheDocument();
  expect(
    screen.getByRole('option', { name: '生産年齢人口' })
  ).toBeInTheDocument();
  expect(screen.getByRole('option', { name: '老年人口' })).toBeInTheDocument();

  // Verify each prefecture checkbox is rendered.
  mockPrefectures.forEach((pref) => {
    expect(screen.getByLabelText(pref.prefName)).toBeInTheDocument();
  });
});

test('Select All button selects all prefectures', () => {
  const onSelectionChange = vi.fn();
  const onPopulationTypeChange = vi.fn();

  render(
    <PrefectureSelector
      prefectures={mockPrefectures}
      selectedPrefectures={[]}
      onSelectionChange={onSelectionChange}
      selectedPopulationType="総人口"
      onPopulationTypeChange={onPopulationTypeChange}
    />
  );

  // Click the "Select All" button.
  const selectAllButton = screen.getByRole('button', { name: /^Select All$/i });
  fireEvent.click(selectAllButton);

  // Expect the callback to be called with all prefecture codes.
  expect(onSelectionChange).toHaveBeenCalledWith(
    mockPrefectures.map((pref) => pref.prefCode)
  );
});

test('Deselect All button clears selection', () => {
  const onSelectionChange = vi.fn();
  const onPopulationTypeChange = vi.fn();

  // Start with all prefectures selected.
  render(
    <PrefectureSelector
      prefectures={mockPrefectures}
      selectedPrefectures={mockPrefectures.map((pref) => pref.prefCode)}
      onSelectionChange={onSelectionChange}
      selectedPopulationType="総人口"
      onPopulationTypeChange={onPopulationTypeChange}
    />
  );

  // Click the "Deselect All" button.
  const deselectAllButton = screen.getByRole('button', {
    name: /Deselect All/i,
  });
  fireEvent.click(deselectAllButton);

  // Expect the callback to be called with an empty array.
  expect(onSelectionChange).toHaveBeenCalledWith([]);
});

test('Clicking on a checkbox toggles selection', () => {
  const onSelectionChange = vi.fn();
  const onPopulationTypeChange = vi.fn();

  // Render with no prefectures selected.
  render(
    <PrefectureSelector
      prefectures={mockPrefectures}
      selectedPrefectures={[]}
      onSelectionChange={onSelectionChange}
      selectedPopulationType="総人口"
      onPopulationTypeChange={onPopulationTypeChange}
    />
  );

  // Get the checkbox for the first prefecture ("北海道").
  const checkbox = screen.getByLabelText('北海道') as HTMLInputElement;

  // Click the checkbox (simulate selecting it).
  fireEvent.click(checkbox);

  // Expect the onSelectionChange callback to be called with [1].
  expect(onSelectionChange).toHaveBeenCalledWith([1]);
});

test('Changing population type triggers onPopulationTypeChange', () => {
  const onSelectionChange = vi.fn();
  const onPopulationTypeChange = vi.fn();

  render(
    <PrefectureSelector
      prefectures={mockPrefectures}
      selectedPrefectures={[]}
      onSelectionChange={onSelectionChange}
      selectedPopulationType="総人口"
      onPopulationTypeChange={onPopulationTypeChange}
    />
  );

  // Get the select element.
  const select = screen.getByRole('combobox') as HTMLSelectElement;

  // Simulate a change event on the select element.
  fireEvent.change(select, { target: { value: '年少人口' } });

  // Expect the population type change callback to be called.
  expect(onPopulationTypeChange).toHaveBeenCalled();
});
