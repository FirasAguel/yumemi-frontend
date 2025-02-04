import useSWR from 'swr';
import { getPopulation } from '@/services/api';
import { ChartPopulationData } from '@/types/interfaces';

const fetchPopulation = async (
  prefCode: number
): Promise<ChartPopulationData> => {
  return await getPopulation(prefCode);
};

export const usePopulationData = (prefCode: number) => {
  const { data, error, isLoading } = useSWR(
    ['population', prefCode],
    () => fetchPopulation(prefCode),
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // cache for 1 hour
    }
  );

  return {
    data,
    isLoading,
    isError: error,
  };
};
