import { mutate } from 'swr';
import { getPopulation } from '@/services/api';
import { ChartPopulationData } from '@/types/interfaces';
import { useState, useEffect, useRef } from 'react';

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

  // Transform all population types during caching
  const transformedData = data.populationData.reduce(
    (acc: { [key: string]: ChartPopulationData }, item) => {
      acc[item.label] = {
        boundaryYear: data.boundaryYear,
        populationData: item.data.map((entry) => ({
          year: entry.year,
          [`Pref-${prefCode}`]: entry.value,
        })),
      };
      return acc;
    },
    {}
  );

  // Cache the fetched data
  mutate(key, transformedData, false);
  return transformedData;
};

export const usePopulationData = (
  prefCodes: number[],
  populationType: string
) => {
  const [combinedData, setCombinedData] = useState<
    { prefCode: number; data: ChartPopulationData }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  let previousType = useRef<string | null>(null);

  useEffect(() => {
    if (previousType.current === populationType) return; // Skip if populationType hasn’t changed
    previousType.current = populationType; // Update the stored type

    console.log('Hook 1 called');
    let isMounted = true;
    const controller = new AbortController();

    const fetchSequentiallyForType = async () => {
      setIsLoading(true);
      setIsError(false);
      setCombinedData([]); // Clear graph to avoid showing old data

      for (const code of prefCodes) {
        try {
          const fullData = await fetchAndCachePrefecture(code);
          const relevantData = fullData[populationType];

          if (isMounted && relevantData) {
            setCombinedData((prevData) => [
              ...prevData,
              { prefCode: code, data: relevantData },
            ]);
          }
        } catch (error) {
          //if (error.name !== 'AbortError' && isMounted) {
          console.log(error);
          setIsError(true);
          //}
        }
      }

      if (isMounted) setIsLoading(false);
    };

    fetchSequentiallyForType();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [populationType, prefCodes]);

  useEffect(() => {
    console.log('Hook 2 called');
    let isMounted = true;
    const controller = new AbortController();

    const fetchSequentially = async () => {
      // Keep already fetched data and only fetch new prefectures
      const alreadyFetched = new Set(combinedData.map((d) => d.prefCode));
      const newPrefCodes = prefCodes.filter(
        (code) => !alreadyFetched.has(code)
      );

      for (const code of newPrefCodes) {
        try {
          const fullData = await fetchAndCachePrefecture(code);
          const relevantData = fullData[populationType];

          if (isMounted && relevantData) {
            setCombinedData((prevData) => [
              ...prevData,
              { prefCode: code, data: relevantData },
            ]);
          }
        } catch (error) {
          //if (error.name !== 'AbortError' && isMounted) {
          console.log(error);
          setIsError(true);
          //}
        }
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
