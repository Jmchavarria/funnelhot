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
        Showing <span className="font-medium">{start}</span> to{' '}
        <span className="font-medium">{end}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Controls */}
      <div className="flex flex-row items-center justify-between gap-2 sm:justify-start">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="
            px-4 py-2
            bg-white border border-gray-200 rounded-lg
            text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-50 transition
          "
        >
          Previous
        </button>

        <span className="px-4 py-2 text-sm text-gray-600 text-center">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </span>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="
            px-4 py-2
            bg-white border border-gray-200 rounded-lg
            text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-50 transition
          "
        >
          Next
        </button>
      </div>
    </div>
  );
};
