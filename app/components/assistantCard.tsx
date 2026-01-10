'use client';

import React, { useState } from 'react';
import {
  EllipsisVertical,
  PlugZap,
  Hash,
  ThumbsUp,
  CheckCircle2,
  BarChart3,
  SquarePen,
  Bot,
  Trash,
  X,
  Check,
} from 'lucide-react';

type Assistant = any;

type Props = {
  item: Assistant;
  index: number;

  // Desktop dropdown
  setButtonRef: (index: number, el: HTMLButtonElement | null) => void;
  onMenuToggle: (index: number) => void;

  // ✅ Mobile inline actions
  onEdit: () => void;
  onDelete: () => void;
  onTrain: () => void;
};

export function AssistantCard({
  item,
  index,
  setButtonRef,
  onMenuToggle,
  onEdit,
  onDelete,
  onTrain,
}: Props) {
  return (
    <>
      {/* ✅ MOBILE */}
      <div className="sm:hidden w-full">
        <MobileAssistantRow item={item} onEdit={onEdit} onDelete={onDelete} onTrain={onTrain} />
      </div>

      {/* ✅ DESKTOP/TABLET */}
      <div className="hidden sm:block w-full">
        <DesktopAssistantCard
          item={item}
          index={index}
          setButtonRef={setButtonRef}
          onMenuToggle={onMenuToggle}
        />
      </div>
    </>
  );
}

/* =========================
   MOBILE ROW (NO DROPDOWN)
   ========================= */

function MobileAssistantRow({
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
            <p className="text-[15px] font-semibold text-gray-900 leading-tight truncate">
              {item.name}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-100 px-2 py-0.5">
                <Hash className="w-3.5 h-3.5" />
                <span className="truncate max-w-[160px]">{item.id}</span>
              </span>

              {item.personality && (
                <span className="inline-flex items-center rounded-full bg-gray-50 border border-gray-100 px-2 py-0.5 truncate max-w-[180px]">
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
          <span className="truncate max-w-[140px]">{period}</span>
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

        {/* ✅ Mobile actions (buttons inside the card) */}
        {!confirmDelete ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <ActionBtn onClick={onEdit} icon={<SquarePen className="w-4 h-4" />} label="Editar" />
            <ActionBtn onClick={onTrain} icon={<Bot className="w-4 h-4" />} label="Entrenar" />
            <ActionBtn
              onClick={() => setConfirmDelete(true)}
              icon={<Trash className="w-4 h-4" />}
              label="Eliminar"
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
              Cancelar
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 h-10 rounded-xl bg-red-600 text-white text-sm font-medium active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  onClick,
  icon,
  label,
  danger,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'h-10 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98]',
        danger
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-gray-200 bg-white text-gray-900',
      ].join(' ')}
    >
      {icon}
      <span className="text-[13px]">{label}</span>
    </button>
  );
}

function Chip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-2.5 py-2">
      <div className="flex items-center gap-1.5 text-gray-700">
        {icon}
        <span className="text-[13px] font-semibold">{value}</span>
      </div>
      <p className="mt-0.5 text-[10px] text-gray-500">{label}</p>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className={`w-2 h-2 rounded-full ${color}`} />;
}

/* =========================
   DESKTOP CARD (dropdown)
   ========================= */

function DesktopAssistantCard({
  item,
  index,
  setButtonRef,
  onMenuToggle,
}: {
  item: Assistant;
  index: number;
  setButtonRef: (index: number, el: HTMLButtonElement | null) => void;
  onMenuToggle: (index: number) => void;
}) {
  return (
    <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm transition-all p-4 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="pr-10">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {item.name}
        </h3>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" />
            {item.id}
          </span>
          <span>{item.personality}</span>
        </div>
      </div>

      {/* Content */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mt-4">
        <ChargesSection charges={item.charges} />
        <SystemsSection systems={item.systems} />
        <SatisfactionSection satisfaction={item.satisfaction} />
      </div>

      {/* Menu button */}
      <button
        ref={(el) => setButtonRef(index, el)}
        className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition"
        onClick={(e) => {
          e.stopPropagation();
          onMenuToggle(index);
        }}
        aria-label="Open menu"
      >
        <EllipsisVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
      </button>
    </div>
  );
}

/* ---------------- Sections (desktop) ---------------- */

function ChargesSection({ charges }: { charges?: any }) {
  return (
    <Section title="Charges">
      <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-6">
        <Metric icon={<PlugZap className="w-4 h-4" />} value={charges?.inUse ?? 0} label="In use" dotClass="bg-green-500" />
        <Metric icon={<PlugZap className="w-4 h-4" />} value={charges?.free ?? 0} label="Free" dotClass="bg-blue-400" />
        <Metric icon={<PlugZap className="w-4 h-4" />} value={charges?.offline ?? 0} label="Offline" dotClass="bg-gray-300" />
      </div>
    </Section>
  );
}

function SystemsSection({ systems }: { systems?: any }) {
  return (
    <Section title="Systems" className="lg:border-l lg:border-r lg:border-gray-100 lg:px-8">
      <div className="flex gap-10 items-center justify-center">
        <div>
          <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
            <CheckCircle2 className="w-4 h-4" />
            {systems?.workStatus ?? '—'}
          </div>
          <p className="text-xs text-gray-500">Work status</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <BarChart3 className="w-4 h-4" />
            {systems?.fuelInStorage ?? 0}%
          </div>
          <p className="text-xs text-gray-500">Fuel in storage</p>
        </div>
      </div>
    </Section>
  );
}

function SatisfactionSection({ satisfaction }: { satisfaction?: any }) {
  return (
    <Section title="Satisfaction">
      <div>
        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <ThumbsUp className="w-4 h-4" />
          {satisfaction?.percentage ?? 0}%
        </div>
        <p className="text-xs text-gray-500">{satisfaction?.period ?? '—'}</p>
      </div>
    </Section>
  );
}

function Section({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className="text-xs font-medium text-gray-500 mb-2">{title}</h4>
      {children}
    </div>
  );
}

function Metric({
  icon,
  value,
  label,
  dotClass,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  dotClass: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 text-lg sm:text-xl font-bold text-gray-900">
        {icon}
        {value}
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        {label}
      </div>
    </div>
  );
}