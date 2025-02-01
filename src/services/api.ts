'use server';

export default async function getPrefectures() {
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
