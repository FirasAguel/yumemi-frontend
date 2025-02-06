import { mutate } from 'swr';
import { getPopulation } from '@/services/api';
import { ChartPopulationData } from '@/types/interfaces';
import { useState, useEffect } from 'react';

// Function to fetch and cache prefecture data without using hooks
export const fetchAndCachePrefecture = async (prefCode: number) => {
  const key = ['population', prefCode];

  // Check if data is already cached via mutate with revalidation set to false
  const cachedData = await mutate(key, undefined, false); // false prevents revalidation
  if (cachedData) {
    return cachedData; // Return cached data if available
  }

  // Fetch if data isn't cached
  const data = await getPopulation(prefCode);

  // Cache the fetched data
  mutate(key, { prefCode, data }, false); // Cache without revalidation

  return { prefCode, data };
};

export const usePopulationData = (prefCodes: number[]) => {
  const [combinedData, setCombinedData] = useState<
    { prefCode: number; data: ChartPopulationData }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSequentially = async () => {
      setIsLoading(true);
      setIsError(false);

      // Keep already fetched data and only fetch new prefectures
      const alreadyFetched = new Set(combinedData.map((d) => d.prefCode));
      const newPrefCodes = prefCodes.filter(
        (code) => !alreadyFetched.has(code)
      );

      for (const code of newPrefCodes) {
        try {
          const data = await fetchAndCachePrefecture(code);
          if (isMounted) {
            setCombinedData((prevData) => [...prevData, data]);
          }
        } catch (error) {
          //if (error.name !== 'AbortError' && isMounted) {
          console.log(error);
          setIsError(true);
          //}
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchSequentially();

    // Cancel fetches when prefectures are deselected or component unmounts
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [prefCodes]);

  // Filter combined data to match selected prefectures (handles deselection)
  const filteredData = combinedData.filter((d) =>
    prefCodes.includes(d.prefCode)
  );
  const combinedPopulationData = combinePopulationData(filteredData);

  return { data: combinedPopulationData, isLoading, isError };
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
