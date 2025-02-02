import { getPrefectures, getPopulation } from '@/services/api';
import PrefectureSelector from '@/components/PrefectureSelector';
import PopulationChart from '@/components/PopulationChart';

export default async function Home() {
  const prefectures = await getPrefectures();
  //const { boundaryYear, populationData } = await getPopulation(1);
  const data1 = await getPopulation(1);
  const data2 = await getPopulation(2);
  console.log(data1);
  console.log(data2);
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-5 text-center text-xl font-semibold">
        <h1>Welcome to my Yumemi frontend test submission</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">
          This is a minimal Next.js setup.
        </p>
        <PrefectureSelector prefectures={prefectures} />
        <div className="w-1/2 max-w-4xl h-auto p-4">
          <h2>人口構成グラフ</h2>
          <PopulationChart
            populationData={data1.populationData}
            boundaryYear={data1.boundaryYear}
          />
        </div>
      </main>
      <footer className="p-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Firas. All rights reserved.
      </footer>
    </div>
  );
}
