'use client';
import { useState } from 'react';

export default function PrefectureSelector({
  prefectures,
}: {
  prefectures: { prefCode: number; prefName: string }[];
}) {
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);

  const toggleSelection = (prefCode: number) => {
    setSelectedPrefectures((prevSelected) =>
      prevSelected.includes(prefCode)
        ? prevSelected.filter((code) => code !== prefCode)
        : [...prevSelected, prefCode]
    );
  };

  const selectAll = () => {
    const allPrefCodes = prefectures.map((pref) => pref.prefCode);
    setSelectedPrefectures(allPrefCodes);
  };

  const deselectAll = () => {
    setSelectedPrefectures([]);
  };

  return (
    <>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={selectAll}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Select All
        </button>
        <button
          onClick={deselectAll}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Deselect All
        </button>
      </div>
      <div className="flex flex-wrap w-108 space-x-2">
        {prefectures.map(
          (prefecture: { prefCode: number; prefName: string }) => {
            return (
              <div key={prefecture.prefCode} className="flex space-x-2 w-25">
                <input
                  type="checkbox"
                  id={`pref-${prefecture.prefCode}`}
                  checked={selectedPrefectures.includes(prefecture.prefCode)}
                  onChange={() => toggleSelection(prefecture.prefCode)}
                ></input>
                <label htmlFor={`pref-${prefecture.prefCode}`}>
                  {prefecture.prefName}
                </label>
              </div>
            );
          }
        )}
      </div>
    </>
  );
}
