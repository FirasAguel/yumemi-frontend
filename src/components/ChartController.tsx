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
  const [selectedPopulationType, setSelectedPopulationType] =
    useState('総人口');

  const handlePopulationTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPopulationType(event.target.value);
  };
  return (
    <div className="flex w-full flex-col flex-wrap items-center justify-center space-y-4 px-4 md:py-4 lg:flex-row lg:space-y-0">
      <div className="ml-4 flex-shrink-0 content-center lg:w-1/4">
        <PrefectureSelector
          prefectures={prefectures}
          selectedPrefectures={selectedPrefectures}
          onSelectionChange={setSelectedPrefectures}
          selectedPopulationType={selectedPopulationType}
          onPopulationTypeChange={handlePopulationTypeChange}
        />
      </div>
      <div className="h-auto w-full flex-1 pr-4 lg:w-3/4">
        <h2>人口構成グラフ</h2>
        <PopulationChart
          prefectures={prefectures}
          selectedPrefectures={selectedPrefectures}
          populationType={selectedPopulationType}
        />
      </div>
    </div>
  );
}
