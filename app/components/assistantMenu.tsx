'use client';

import React, { useState, useEffect } from 'react';
import { Trash, SquarePen, Bot, Check, X } from 'lucide-react';

type Props = {
  open: boolean;
  top: number;
  left: number;
  menuRef: React.RefObject<HTMLDivElement>;

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

  return (
    <div
      ref={menuRef}
      className="menu-dropdown fixed w-36 bg-white shadow-xl rounded-lg border border-gray-200 z-50 overflow-hidden"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      {!confirmDelete ? (
        <>
          <button
            className="w-full px-4 py-2.5 text-sm hover:bg-gray-100 flex items-center gap-2"
            onClick={onEdit}
          >
            <SquarePen className="w-4 h-4" />
            Editar
          </button>

          <button
            className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash className="w-4 h-4" />
            Eliminar
          </button>

          <button
            className="w-full px-4 py-2.5 text-sm hover:bg-gray-100 flex items-center gap-2"
            onClick={onTrain}
          >
            <Bot className="w-4 h-4" />
            Entrenar
          </button>
        </>
      ) : (
        <div className="p-3 space-y-2">
          <p className="text-xs text-gray-500 text-center">
            ¿Eliminar asistente?
          </p>

          <button
            className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md border text-xs hover:bg-gray-50"
            onClick={() => setConfirmDelete(false)}
          >
            <X className="w-3.5 h-3.5" />
            Cancelar
          </button>

          <button
            className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-red-600 text-white text-xs hover:bg-red-700"
            onClick={onDelete}
          >
            <Check className="w-3.5 h-3.5" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
