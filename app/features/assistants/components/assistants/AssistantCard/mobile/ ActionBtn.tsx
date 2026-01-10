'use client';

import React from 'react';

export function ActionBtn({
  onClick,
  icon,
  label,
  danger,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'h-10 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98]',
        danger ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-900',
      ].join(' ')}
    >
      {icon}
      <span className="text-[13px]">{label}</span>
    </button>
  );
}
