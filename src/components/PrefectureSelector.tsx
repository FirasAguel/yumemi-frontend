import { Prefecture } from '@/types/interfaces';
import { useState } from 'react';

export default function PrefectureSelector({
  prefectures,
  selectedPrefectures,
  onSelectionChange,
  selectedPopulationType,
  onPopulationTypeChange,
}: {
  prefectures: Prefecture[];
  selectedPrefectures: number[];
  onSelectionChange: (selected: number[]) => void;
  selectedPopulationType: string;
  onPopulationTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const selectAll = () => {
    const allPrefCodes = prefectures.map((pref) => pref.prefCode);
    onSelectionChange(allPrefCodes);
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  const [lastClickedPrefCode, setLastClickedPrefCode] = useState<number | null>(
    null
  );

  const handleCheckboxClick = (
    prefCode: number,
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    let newSelected = [...selectedPrefectures];

    if (event.shiftKey && lastClickedPrefCode !== null) {
      const start = Math.min(lastClickedPrefCode, prefCode);
      const end = Math.max(lastClickedPrefCode, prefCode);

      const isSelecting = !selectedPrefectures.includes(prefCode);

      for (let code = start; code <= end; code++) {
        if (isSelecting) {
          if (!newSelected.includes(code)) {
            newSelected.push(code);
          }
        } else {
          newSelected = newSelected.filter(
            (selectedCode) => selectedCode !== code
          );
        }
      }
    } else {
      newSelected = selectedPrefectures.includes(prefCode)
        ? selectedPrefectures.filter((code) => code !== prefCode)
        : [...selectedPrefectures, prefCode];
    }

    onSelectionChange(newSelected);
    setLastClickedPrefCode(prefCode);
  };

  // TODO: Refactor checkbox + label elements into a separate React component (PrefectureCheckbox).
  // As part of this refactor, implement shift-click support on <label> to ensure consistent selection
  // behavior when clicking either the checkbox or the label.

  const populationTypes = [
    { value: '総人口', label: '総人口' },
    { value: '年少人口', label: '年少人口' },
    { value: '生産年齢人口', label: '生産年齢人口' },
    { value: '老年人口', label: '老年人口' },
  ];

  return (
    <div className="flex w-fit flex-col items-start">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={selectAll}
          className="my-auto mb-2 h-min rounded bg-blue-500 px-4 py-2 text-white"
        >
          Select All
        </button>
        <button
          onClick={deselectAll}
          className="my-auto mb-2 h-min rounded bg-red-500 px-4 py-2 text-white"
        >
          Deselect All
        </button>
        <div className="py-2">
          <label className="mb-1 block text-sm font-medium">
            Population Type
          </label>
          <select
            value={selectedPopulationType}
            onChange={onPopulationTypeChange}
            className="w-full rounded-md border border-gray-300 p-1"
          >
            {populationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex max-w-104 flex-wrap gap-1">
        {prefectures.map((prefecture) => (
          <div key={prefecture.prefCode} className="flex w-25 space-x-2">
            <input
              type="checkbox"
              id={`pref-${prefecture.prefCode}`}
              checked={selectedPrefectures.includes(prefecture.prefCode)}
              onClick={(e) => handleCheckboxClick(prefecture.prefCode, e)}
              onChange={() => {}} // Dummy handler for React warnings
            ></input>
            <label htmlFor={`pref-${prefecture.prefCode}`}>
              {prefecture.prefName}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
