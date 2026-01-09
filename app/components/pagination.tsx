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
  onNext
}) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Mostrando {start} a {end} de {totalItems} resultados
      </div>

      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          Anterior
        </button>

        <span className="px-4 py-2 text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
