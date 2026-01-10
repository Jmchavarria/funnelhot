'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';

type Props = {
  title: string;
  hasItems: boolean;
  onClearAll: () => void;
  onNew: () => void;
  disabled?: boolean;
  hideNewOnMobile?: boolean;
};

export function TableHeader({
  title,
  hasItems,
  onClearAll,
  onNew,
  disabled,
  hideNewOnMobile,
}: Props) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
          {title}
        </h2>

        <div className="flex gap-3">
          {hasItems && (
            <button
              disabled={disabled}
              onClick={() => {
                if (confirm('¿Estás seguro de eliminar todos los asistentes?')) onClearAll();
              }}
              className="cursor-pointer group px-4 py-2 flex gap-2 items-center justify-center rounded-lg transition-all duration-200 ease-out bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <span className="transition-transform duration-200 group-hover:scale-105">
                Clear All
              </span>
              <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
            </button>
          )}

          <button
            disabled={disabled}
            onClick={onNew}
            className={[
              'hidden sm:flex cursor-pointer group px-4 py-2 gap-2 items-center justify-center rounded-lg transition-all duration-200 ease-out bg-white text-gray-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-50 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0',
            ].join(' ')}
          >
            <span className="transition-transform duration-200 group-hover:scale-105">
              New Assistant
            </span>
            <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
          </button>

        </div>
      </div>
    </div>
  );
}