'use client';

import React, { useState, useEffect } from 'react';
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

  // ✅ helper para evitar que el "click outside" cierre antes de ejecutar
  const stop = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      ref={menuRef}
      // ✅ IMPORTANTÍSIMO: mousedown/click dentro del menú NO debe propagarse
      onMouseDown={stop}
      onClick={stop}
      className="
        fixed w-36
        bg-white border border-gray-200
        rounded-lg shadow-xl
        z-50 overflow-hidden
        animate-in fade-in zoom-in-95
      "
      style={{ top: `${top}px`, left: `${left}px` }}
      role="menu"
    >
      {!confirmDelete ? (
        <>
          {/* Edit */}
          <button
            type="button"
            // ✅ usa onMouseDown para ganar al document mousedown
            onMouseDown={(e) => {
              stop(e);
              onEdit();
            }}
            className="
                        cursor-pointer
              group w-full px-4 py-2.5 text-sm
              flex items-center gap-2
              transition-all duration-150
              hover:bg-gray-100 hover:pl-5
              active:bg-gray-200
              focus:outline-none focus:bg-gray-100
            "
          >
            <SquarePen className="w-4 h-4 transition-transform group-hover:rotate-6" />
            Editar
          </button>

          {/* Delete (confirm step) */}
          <button
            type="button"
            onMouseDown={(e) => {
              stop(e);
              setConfirmDelete(true);
            }}
            className="
                        cursor-pointer
              group w-full px-4 py-2.5 text-sm text-red-600
              flex items-center gap-2
              transition-all duration-150
              hover:bg-red-50 hover:pl-5
              active:bg-red-100
              focus:outline-none focus:bg-red-50
            "
          >
            <Trash className="w-4 h-4 transition-transform group-hover:scale-110" />
            Eliminar
          </button>

          {/* Train */}
          <button
            type="button"
            onMouseDown={(e) => {
              stop(e);
              onTrain();
            }}
            className="
                        cursor-pointer
              group w-full px-4 py-2.5 text-sm
              flex items-center gap-2
              transition-all duration-150
              hover:bg-gray-100 hover:pl-5
              active:bg-gray-200
              focus:outline-none focus:bg-gray-100
            "
          >
            <Bot className="w-4 h-4 transition-transform group-hover:-rotate-6" />
            Entrenar
          </button>
        </>
      ) : (
        <div className="p-3 space-y-2 animate-in fade-in">
          <p className="text-xs text-gray-500 text-center">¿Eliminar asistente?</p>

          {/* Cancel */}
          <button
            type="button"
            onMouseDown={(e) => {
              stop(e);
              setConfirmDelete(false);
            }}
            className="
                        cursor-pointer
              group w-full px-2 py-1.5
              flex items-center justify-center gap-1
              rounded-md border text-xs
              transition-all duration-150
              hover:bg-gray-50 hover:-translate-y-0.5
              active:translate-y-0
              focus:outline-none focus:ring-2 focus:ring-gray-200
            "
          >
            <X className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
            Cancelar
          </button>

          {/* Confirm delete */}
          <button
            type="button"
            onMouseDown={(e) => {
              stop(e);
              onDelete();
            }}
            className="
            cursor-pointer
              group w-full px-2 py-1.5
              flex items-center justify-center gap-1
              rounded-md bg-red-600 text-white text-xs
              transition-all duration-150
              hover:bg-red-700 hover:-translate-y-0.5
              active:translate-y-0
              focus:outline-none focus:ring-2 focus:ring-red-300
            "
          >
            <Check className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
