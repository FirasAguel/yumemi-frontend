import { getPrefectures } from '@/services/api';
import { Prefecture } from '@/types/interfaces';
import ChartController from '@/components/ChartController';

export default async function Home() {
  const prefectures: Prefecture[] = await getPrefectures();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="p-5 text-center text-4xl font-light">
        <h1>都道府県人口グラフ</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center">
        <ChartController prefectures={prefectures} />
      </main>
    </div>
  );
}
