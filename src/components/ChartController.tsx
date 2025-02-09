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
    <div className="flex flex-wrap lg:flex-nowrap items-center justify-center w-full p-4 space-y-4 lg:space-y-0">
      <div className="w-full lg:w-1/3 lg:max-w-md flex-shrink-0 ml-4">
        <PrefectureSelector
          prefectures={prefectures}
          selectedPrefectures={selectedPrefectures}
          onSelectionChange={setSelectedPrefectures}
          selectedPopulationType={selectedPopulationType}
          onPopulationTypeChange={handlePopulationTypeChange}
        />
      </div>
      <div className="flex-1 w-1/2 h-auto p-4">
        <h2>人口構成グラフ</h2>
        <PopulationChart
          selectedPrefectures={selectedPrefectures}
          populationType={selectedPopulationType}
        />
      </div>
    </div>
  );
}
