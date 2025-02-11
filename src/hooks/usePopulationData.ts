'use client';
import { useState, useEffect, useRef } from 'react';
import { getPopulation } from '@/services/api';
import { ChartPopulationData, FullPopulationData } from '@/types/interfaces';

// Module level custom cache
const populationCache = new Map<
  number,
  { [key: string]: ChartPopulationData }
>();

export const fetchAndCachePrefecture = async (
  prefCode: number
): Promise<{ [key: string]: ChartPopulationData }> => {
  console.log(populationCache);
  if (populationCache.has(prefCode)) {
    return populationCache.get(prefCode)!;
  }

  // Fetch if data isn't cached
  const data: FullPopulationData = await getPopulation(prefCode);

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
  populationCache.set(prefCode, transformedData);
  return transformedData;
};

export const usePopulationData = (
  prefCodes: number[],
  populationType: string
) => {
  const [combinedData, setCombinedData] = useState<
    { prefCode: number; data: ChartPopulationData }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const previousType = useRef<string | null>(null);

  // Effect for handling changes in populationType
  useEffect(() => {
    if (prefCodes.length === 0) return;

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

  // Effect for handling the addition of new prefectures without changing populationType.
  useEffect(() => {
    if (prefCodes.length === 0) return;

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
  }, [populationType, combinedData, prefCodes]);

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
