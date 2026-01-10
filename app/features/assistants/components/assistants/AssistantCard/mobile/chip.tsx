'use client';

import React from 'react';

export function Chip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-2.5 py-2">
      <div className="flex items-center gap-1.5 text-gray-700">
        {icon}
        <span className="text-[13px] font-semibold">{value}</span>
      </div>
      <p className="mt-0.5 text-[10px] text-gray-500">{label}</p>
    </div>
  );
}
