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
    <div className="flex flex-col lg:flex-row flex-wrap items-center justify-center w-full px-4 md:py-4 space-y-4 lg:space-y-0">
      <div className="lg:w-1/4 flex-shrink-0 ml-4 content-center">
        <PrefectureSelector
          prefectures={prefectures}
          selectedPrefectures={selectedPrefectures}
          onSelectionChange={setSelectedPrefectures}
          selectedPopulationType={selectedPopulationType}
          onPopulationTypeChange={handlePopulationTypeChange}
        />
      </div>
      <div className="flex-1 w-full lg:w-3/4 h-auto pr-4">
        <h2>人口構成グラフ</h2>
        <PopulationChart
          selectedPrefectures={selectedPrefectures}
          populationType={selectedPopulationType}
        />
      </div>
    </div>
  );
}
