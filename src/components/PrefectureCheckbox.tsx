'use client';
import React from 'react';

interface PrefectureCheckboxProps {
  prefCode: number;
  prefName: string;
  checked: boolean;
  onCheckboxClick: (
    prefCode: number,
    event: React.MouseEvent<HTMLElement>
  ) => void;
}

const PrefectureCheckbox = ({
  prefCode,
  prefName,
  checked,
  onCheckboxClick,
}: PrefectureCheckboxProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onCheckboxClick(prefCode, e);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent text selection during shift-click.
    if (e.shiftKey) {
      e.preventDefault();
    }
  };

  return (
    <div
      className="group flex w-25 cursor-pointer space-x-2 rounded transition-colors"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <input
        type="checkbox"
        checked={checked}
        readOnly
        className="pointer-events-none transition-colors group-hover:border-blue-500"
      />
      <span className="transition-colors group-hover:text-blue-500">
        {prefName}
      </span>
    </div>
  );
};

export default React.memo(PrefectureCheckbox);
