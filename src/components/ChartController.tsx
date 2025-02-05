'use client';
import PrefectureSelector from '@/components/PrefectureSelector';
import PopulationChart from '@/components/PopulationChart';
import { Prefecture } from '@/types/interfaces';
import { useState } from 'react';

export default function ChartController({
  prefectures,
}: {
  prefectures: Prefecture[];
}) {
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full">
      <PrefectureSelector
        prefectures={prefectures}
        selectedPrefectures={selectedPrefectures}
        onSelectionChange={setSelectedPrefectures}
      />
      <div className="w-1/2 max-w-4xl h-auto p-4">
        <h2>人口構成グラフ</h2>
        <PopulationChart selectedPrefectures={selectedPrefectures} />
      </div>
    </div>
  );
}
