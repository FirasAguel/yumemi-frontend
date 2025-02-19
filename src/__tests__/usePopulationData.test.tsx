import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { usePopulationData } from '@/hooks/usePopulationData';
import { getPopulation } from '@/services/api';
import { FullPopulationData } from '@/types/interfaces'
import * as api from '@/services/api';

// Create a test component to use the hook.
const TestComponent = ({
  prefCodes,
  populationType,
}: {
  prefCodes: number[];
  populationType: string;
}) => {
  const { data, isLoading, isError } = usePopulationData(
    prefCodes,
    populationType
  );
  return (
    <div>
      {isLoading && <div data-testid="loading">Loading...</div>}
      {isError && <div data-testid="error">Error</div>}
      {data && <div data-testid="data">{JSON.stringify(data)}</div>}
    </div>
  );
};

// Mock getPopulation similar to the previous test.
vi.mock('@/services/api', () => ({
  getPopulation: vi.fn(async (prefCode: number) => ({
    boundaryYear: 2020,
    populationData: [
      {
        label: '総人口',
        data: [
          { year: 2000, value: 1000 + prefCode }, // differentiate by prefCode
          { year: 2005, value: 1100 + prefCode },
        ],
      },
      {
        label: '年齢別人口',
        data: [
          { year: 2000, value: 500 + prefCode },
          { year: 2005, value: 550 + prefCode },
        ],
      },
    ],
  })),
}));

describe('usePopulationData', () => {
  it('fetches and combines data correctly for given prefectures', async () => {
    render(<TestComponent prefCodes={[1, 2]} populationType="総人口" />);

    // Wait until loading is finished.
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Assert that data is rendered.
    const dataOutput = screen.getByTestId('data');
    const parsedData = JSON.parse(dataOutput.textContent || '{}');

    // Verify that the combined data includes a populationData array and boundaryYears object.
    expect(parsedData).toHaveProperty('populationData');
    expect(parsedData).toHaveProperty('boundaryYears');

    // You can add more assertions based on your expected combined format.
    expect(parsedData.populationData.length).toBeGreaterThan(0);
  });

  it('handles fetch errors and sets isError', async () => {
    // Mock getPopulation to throw an error
    vi.spyOn(api, 'getPopulation').mockRejectedValue(new Error('Fetch error'));
  
    render(<TestComponent prefCodes={[3]} populationType="総人口" />);
  
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
    // Restore the original implementation after the test
    vi.restoreAllMocks();
  });

});
