'use client';

import React from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

type Props = {
  title: string;
  hasItems: boolean;
  onClearAll: () => void;
  onNew: () => void;
  disabled?: boolean;
};

export function TableHeader({
  title,
  hasItems,
  onClearAll,
  onNew,
  disabled,
}: Props) {
  const handleClearAll = () => {
    if (confirm('¿Eliminar todos los asistentes?')) {
      onClearAll();
    }
  };

  return (
    <div className="mb-4 sm:mb-6">
      {/* Layout general */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <h2 className="text-base sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center sm:text-left">
          {title}
        </h2>

        {/* Desktop actions */}
        <div className="hidden sm:flex gap-3">
          {hasItems && (
            <button
              disabled={disabled}
              onClick={handleClearAll}
              className="
                cursor-pointer group
                px-4 py-2
                flex gap-2 items-center justify-center
                rounded-lg
                transition-all duration-200 ease-out
                bg-white text-red-600
                border border-red-200
                hover:bg-red-50 hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-red-200
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              <span className="group-hover:scale-105 transition-transform">
                Clear All
              </span>
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            </button>
          )}

          <button
            disabled={disabled}
            onClick={onNew}
            className="
              cursor-pointer group
              px-4 py-2
              gap-2 flex items-center justify-center
              rounded-lg
              transition-all duration-200 ease-out
              bg-white text-gray-900 shadow-sm
              hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-gray-300
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            <span className="group-hover:scale-105 transition-transform">
              New Assistant
            </span>
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      {/* ✅ MOBILE CLEAR ALL */}
      {hasItems && (
        <div className="sm:hidden mt-2 flex justify-center">
          <button
            disabled={disabled}
            onClick={handleClearAll}
            className="
              flex items-center gap-2
              px-3 py-1.5
              rounded-full
              text-xs font-medium
              text-red-600
              bg-red-50
              border border-red-200
              active:scale-95
              transition
              disabled:opacity-60
            "
          >
            <Trash2 className="w-4 h-4" />
            Eliminar todos
          </button>
        </div>
      )}
    </div>
  );
}
