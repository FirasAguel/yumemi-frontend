import useSWR from 'swr';
import { getPopulation } from '@/services/api';
import { ChartPopulationData } from '@/types/interfaces';

// Fetch data for a single prefecture
const fetchPopulation = async (
  prefCode: number
): Promise<{ prefCode: number; data: ChartPopulationData }> => {
  const data = await getPopulation(prefCode);
  return { prefCode, data };
};

export const usePopulationData = (prefCodes: number[]) => {
  const fetchAllPopulations = async () => {
    const responses = await Promise.all(
      prefCodes.map((code) => fetchPopulation(code))
    );
    return combinePopulationData(responses);
  };

  const { data, error, isLoading } = useSWR(
    prefCodes.length ? ['population', ...prefCodes] : null,
    fetchAllPopulations,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // Cache for 1 hour
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};

// Function to combine population data into the required format
const combinePopulationData = (
  responses: { prefCode: number; data: ChartPopulationData }[]
) => {
  console.log(responses); // Full response structure

  const boundaryYears: { [key: string]: number } = {};
  const combinedPopulationData: { year: number; [key: string]: number }[] = [];

  responses.forEach(({ prefCode, data }) => {
    const { boundaryYear, populationData } = data;
    const prefKey = `Pref-${prefCode}`;
    boundaryYears[prefKey] = boundaryYear;

    populationData.forEach((entry) => {
      let yearEntry = combinedPopulationData.find((e) => e.year === entry.year);

      if (!yearEntry) {
        // If no entry exists for this year, create one
        yearEntry = { year: entry.year };
        combinedPopulationData.push(yearEntry);
      }
      yearEntry[prefKey] = entry[prefKey];
    });
  });

  console.log('Combined Population Data:', combinedPopulationData);

  return { populationData: combinedPopulationData, boundaryYears };
};
