import { Prefecture } from '@/types/interfaces';
import { useState } from 'react';

export default function PrefectureSelector({
  prefectures,
  selectedPrefectures,
  onSelectionChange,
}: {
  prefectures: Prefecture[];
  selectedPrefectures: number[];
  onSelectionChange: (selected: number[]) => void;
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
        {prefectures.map((prefecture) => (
          <div key={prefecture.prefCode} className="flex space-x-2 w-25">
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
    </>
  );
}
