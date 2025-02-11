'use client';
import React from 'react';

interface PrefectureCheckboxProps {
  prefCode: number;
  prefName: string;
  checked: boolean;
  onCheckboxClick: (
    prefCode: number,
    event: React.MouseEvent<HTMLInputElement>
  ) => void;
}

const PrefectureCheckbox = ({
  prefCode,
  prefName,
  checked,
  onCheckboxClick,
}: PrefectureCheckboxProps) => {
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    onCheckboxClick(prefCode, e);
  };

  const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    // Pass the event from the label to the checkbox click handler.
    // Casting the event as the expected type since both share the 'shiftKey' property.
    onCheckboxClick(
      prefCode,
      e as unknown as React.MouseEvent<HTMLInputElement>
    );
  };

  return (
    <div className="flex w-25 space-x-2">
      <input
        type="checkbox"
        id={`pref-${prefCode}`}
        checked={checked}
        onClick={handleInputClick}
        onChange={() => {}} // Dummy handler to satisfy React
      />
      <label htmlFor={`pref-${prefCode}`} onClick={handleLabelClick}>
        {prefName}
      </label>
    </div>
  );
};

export default PrefectureCheckbox;
