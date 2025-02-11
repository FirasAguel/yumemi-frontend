'use server';

import { Prefecture, FullPopulationData } from '@/types/interfaces';

export async function getPrefectures(): Promise<Prefecture[]> {
  const res = await fetch(
    `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures`,
    {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.X_API_KEY || '',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch prefectures');
  }

  const json = await res.json();

  return json.result;
}

export async function getPopulation(
  prefCode: number
): Promise<FullPopulationData> {
  if (prefCode < 1 || prefCode > 47) {
    throw new Error(`There is no prefecture with the code ${prefCode}`);
  }

  const res = await fetch(
    `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?prefCode=${prefCode}`,
    {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.X_API_KEY || '',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch prefectures');
  }

  const json = await res.json();

  return {
    boundaryYear: json.result.boundaryYear,
    populationData: json.result.data,
  };
}
