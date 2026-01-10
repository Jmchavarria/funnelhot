'use client';

import React from 'react';

export function Metric({
  icon,
  value,
  label,
  dotClass,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  dotClass: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 text-lg sm:text-xl font-bold text-gray-900">
        {icon}
        {value}
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        {label}
      </div>
    </div>
  );
}
