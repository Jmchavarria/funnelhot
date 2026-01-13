'use client';

import React, { useState } from 'react';
import {
  PlugZap,
  ThumbsUp,
  CheckCircle2,
  BarChart3,
  SquarePen,
  Bot,
  Trash,
  X,
  Check,
  Globe,
  Sparkles,
} from 'lucide-react';

import { Chip } from './chip';
import { Dot } from './dot';
import { ActionBtn } from './ ActionBtn';

type Assistant = any;

export function MobileAssistantRow({
  item,
  onEdit,
  onDelete,
  onTrain,
}: {
  item: Assistant;
  onEdit: () => void;
  onDelete: () => void;
  onTrain: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const inUse = item.charges?.inUse ?? 0;
  const free = item.charges?.free ?? 0;
  const offline = item.charges?.offline ?? 0;

  const fuel = item.systems?.fuelInStorage ?? 0;
  const workStatus = item.systems?.workStatus ?? '—';

  const sat = item.satisfaction?.percentage ?? 0;
  const period = item.satisfaction?.period ?? '—';

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-gray-900 leading-tight truncate">{item.name}</p>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-100 px-2 py-0.5">
                <Globe className="w-3.5 h-3.5" />
                <span className="truncate max-w-40">{item.language}</span>
              </span>

              {item.personality && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-100 px-2 py-0.5 truncate max-w-45">
                  <Sparkles className="w-3.5 h-3.5" />
                  {item.personality}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chips */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Chip icon={<PlugZap className="w-4 h-4" />} label="In use" value={inUse} />
          <Chip icon={<BarChart3 className="w-4 h-4" />} label="Fuel" value={`${fuel}%`} />
          <Chip icon={<ThumbsUp className="w-4 h-4" />} label="Sat" value={`${sat}%`} />
        </div>

        {/* Secondary line */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
          <span className="inline-flex items-center gap-1 min-w-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <span className="truncate">{workStatus}</span>
          </span>
          <span className="truncate max-w-35">{period}</span>
        </div>

        {/* Charges micro summary */}
        <div className="mt-2 flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-gray-500">
          <Dot color="bg-green-500" />
          <span>{inUse} in use</span>
          <Dot color="bg-blue-400" />
          <span>{free} free</span>
          <Dot color="bg-gray-300" />
          <span>{offline} offline</span>
        </div>

        {/* Actions */}
        {!confirmDelete ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <ActionBtn onClick={onEdit} icon={<SquarePen className="w-4 h-4" />} label="Edit" />
            <ActionBtn onClick={onTrain} icon={<Bot className="w-4 h-4" />} label="Train" />
            <ActionBtn
              onClick={() => setConfirmDelete(true)}
              icon={<Trash className="w-4 h-4" />}
              label="Delete"
              danger
            />
          </div>
        ) : (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="flex-1 h-10 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-medium active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
