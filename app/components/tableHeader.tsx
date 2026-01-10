'use client';

import React from 'react';
import { Plus } from 'lucide-react';

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
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          {title}
        </h2>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
          {hasItems && (
            <button
              disabled={disabled}
              onClick={() => {
                if (
                  confirm(
                    '¿Estás seguro de eliminar todos los asistentes?',
                  )
                ) {
                  onClearAll();
                }
              }}
              className="
                w-full sm:w-auto
                px-4 py-2
                flex items-center justify-center gap-2
                rounded-lg border border-red-200
                bg-white text-red-600
                hover:bg-red-50 transition
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              Clear All
            </button>
          )}

          <button
            disabled={disabled}
            onClick={onNew}
            className="
              w-full sm:w-auto
              px-4 py-2
              flex items-center justify-center gap-2
              rounded-lg
              bg-white text-gray-900
              shadow-sm
              hover:bg-gray-50 transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            New Assistant
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
