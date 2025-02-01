'use client';

import { Key } from 'react';

export default function PrefectureSelector({
  prefectures,
}: {
  prefectures: { prefCode: number; prefName: string }[];
}) {
  return (
    <>
      <div className="flex flex-wrap w-108 space-x-2">
        {prefectures.map((prefecture: { prefCode: Key; prefName: string }) => {
          return (
            <div key={prefecture.prefCode} className="flex space-x-2 w-25">
              <input type="checkbox" id={`pref-${prefecture.prefCode}`}></input>
              <label htmlFor={`pref-${prefecture.prefCode}`}>
                {prefecture.prefName}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
}
