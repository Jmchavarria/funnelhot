// tableHeader.tsx
'use client';

import React from 'react';
import { Plus } from 'lucide-react';

type Props = {
  title: string;
  hasItems: boolean;
  onClearAll: () => void;
  onNew: () => void;
  disabled?: boolean;

  // ✅ NUEVO
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
              className="px-4 py-2 flex gap-2 items-center justify-center rounded-lg transition cursor-pointer bg-white text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          )}

          {/* ✅ ocultar en mobile si hideNewOnMobile */}
          <button
            disabled={disabled}
            onClick={onNew}
            className={[
              'px-4 py-2 flex gap-2 items-center justify-center rounded-lg transition cursor-pointer bg-white text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed',
              hideNewOnMobile ? 'hidden sm:flex' : '',
            ].join(' ')}
          >
            New Assistant <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
