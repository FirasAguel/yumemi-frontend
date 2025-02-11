import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAndCachePrefecture } from '@/hooks/usePopulationData';
import { getPopulation } from '@/services/api';

// Mock getPopulation to return a sample FullPopulationData object.
vi.mock('@/services/api', () => ({
  getPopulation: vi.fn(async (prefCode: number) => ({
    boundaryYear: 2020,
    populationData: [
      {
        label: '総人口',
        data: [
          { year: 2000, value: 1000 },
          { year: 2005, value: 1100 },
        ],
      },
      {
        label: '年齢別人口',
        data: [
          { year: 2000, value: 500 },
          { year: 2005, value: 550 },
        ],
      },
    ],
  })),
}));

describe('fetchAndCachePrefecture (simple caching)', () => {
  beforeEach(() => {
    // Clear any cached data and reset mocks.
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns cached data on subsequent calls', async () => {
    await fetchAndCachePrefecture(1);
    await fetchAndCachePrefecture(1);
    // Expect getPopulation to be called only once for the same prefecture code.
    expect(getPopulation).toHaveBeenCalledTimes(1);
  });
});
