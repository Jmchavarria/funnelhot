'use client';

import React, { useEffect, useState } from 'react';
import { Trash, SquarePen, Bot, Check, X } from 'lucide-react';

type Props = {
  open: boolean;
  top: number;
  left: number;
  menuRef: React.RefObject<HTMLDivElement | null>;

  onEdit: () => void;
  onDelete: () => void;
  onTrain: () => void;
};

export function AssistantMenu({
  open,
  top,
  left,
  menuRef,
  onEdit,
  onDelete,
  onTrain,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) setConfirmDelete(false);
  }, [open]);

  if (!open) return null;

  const itemBase =
    'cursor-pointer w-full px-4 py-2.5 text-sm flex items-center gap-2 ' +
    'transition-all duration-200 ease-out ' +
    'hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300';

  // Estilo base para los 2 botones de confirmación (mismo tamaño, centrados)
  const confirmBtnBase =
    'w-full flex items-center justify-center gap-2 ' +
    'h-8 px-3 rounded-md text-xs font-medium ' +
    'transition-all duration-150 ' +
    'focus:outline-none focus-visible:ring-2';

  return (
    <div
      ref={menuRef}
      className="
        hidden sm:block menu-dropdown fixed w-40
        bg-white shadow-xl rounded-lg border border-gray-200
        z-50 overflow-hidden
      "
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      {!confirmDelete ? (
        <>
          <button
            className={`${itemBase} text-gray-800 hover:bg-gray-100`}
            onClick={onEdit}
          >
            <SquarePen className="w-4 h-4 transition-transform duration-200 hover:-rotate-6" />
            Edit
          </button>

          <button
            className={`${itemBase} text-red-600 hover:bg-red-50`}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash className="w-4 h-4 transition-transform duration-200 hover:-rotate-6" />
            Delete
          </button>

          <button
            className={`${itemBase} text-gray-800 hover:bg-gray-100`}
            onClick={onTrain}
          >
            <Bot className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
            Train
          </button>
        </>
      ) : (
        <div className="p-3 space-y-2">
          <p className="text-xs text-gray-500 text-center">Delete assistant?</p>

          {/* Cancel (outline con borde, como en la imagen) */}
          <button
            className={`${confirmBtnBase}
              border border-gray-900 text-gray-900 bg-white
              hover:bg-gray-50
              focus-visible:ring-gray-300
            `}
            onClick={() => setConfirmDelete(false)}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>

          {/* Delete (solid rojo, como en la imagen) */}
          <button
            className={`${confirmBtnBase}
              bg-red-600 text-white
              hover:bg-red-700
              focus-visible:ring-red-200
            `}
            onClick={() => {
              const ok = window.confirm(
                '¿Seguro que deseas eliminar este assistant? Esta acción no se puede deshacer.'
              );
              if (ok) onDelete();
            }}
          >
            <Check className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
