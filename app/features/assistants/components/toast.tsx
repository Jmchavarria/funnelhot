'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

type Props = {
  open: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  durationMs?: number;
  kind?: 'success' | 'danger';
};

export function Toast({
  open,
  title,
  message,
  onClose,
  durationMs = 2200,
  kind = 'success',
}: Props) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, durationMs);
    return () => clearTimeout(t);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  const styles =
    kind === 'danger'
      ? {
          wrap: 'bg-red-600 text-white border border-red-700',
          icon: 'bg-red-500',
          msg: 'text-red-100',
          hover: 'hover:bg-red-500',
        }
      : {
          wrap: 'bg-emerald-600 text-white border border-emerald-700',
          icon: 'bg-emerald-500',
          msg: 'text-emerald-100',
          hover: 'hover:bg-emerald-500',
        };

  return (
    <div className="fixed z-[9999] top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-95">
      <div
        className={`flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl ${styles.wrap}`}
      >
        {/* Icon */}
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${styles.icon}`}
        >
          <CheckCircle2 className="w-5 h-5" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{title}</p>
          {message && (
            <p className={`text-xs leading-snug mt-0.5 ${styles.msg}`}>
              {message}
            </p>
          )}
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className={`rounded-lg px-2 py-1 text-white ${styles.hover} shrink-0`}
          aria-label="Close toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
