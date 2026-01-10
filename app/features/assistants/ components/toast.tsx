'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

type Props = {
  open: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  durationMs?: number;
};

export function Toast({ open, title, message, onClose, durationMs = 2200 }: Props) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, durationMs);
    return () => clearTimeout(t);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div className="fixed z-[80] top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[360px]">
      <div className="flex items-start gap-3 rounded-2xl bg-green-600 px-4 py-3 shadow-xl text-white border border-green-700">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-green-500 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{title}</p>
          {message && <p className="text-xs text-green-100 mt-0.5">{message}</p>}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-1 rounded-lg px-2 py-1 text-white hover:bg-green-500 shrink-0"
          aria-label="Close toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
