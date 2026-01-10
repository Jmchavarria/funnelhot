'use client';

import React from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPrev: () => void;
  onNext: () => void;
}

export const PaginationFooter: React.FC<Props> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPrev,
  onNext,
}) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Info */}
      <div className="text-sm text-gray-600 text-center sm:text-left">
        Mostrando <span className="font-medium">{start}</span> a{' '}
        <span className="font-medium">{end}</span> de{' '}
        <span className="font-medium">{totalItems}</span> resultados
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="
            w-full sm:w-auto
            px-4 py-2
            bg-white border border-gray-200 rounded-lg
            text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-50 transition
          "
        >
          Anterior
        </button>

        <span className="px-4 py-2 text-sm text-gray-600 text-center">
          Página <span className="font-medium">{currentPage}</span> de{' '}
          <span className="font-medium">{totalPages}</span>
        </span>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="
            w-full sm:w-auto
            px-4 py-2
            bg-white border border-gray-200 rounded-lg
            text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-50 transition
          "
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
