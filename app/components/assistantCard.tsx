'use client';

import React from 'react';
import {
  EllipsisVertical,
  PlugZap,
  Hash,
  ThumbsUp,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';

type Assistant = any;

type Props = {
  item: Assistant;
  index: number;
  setButtonRef: (index: number, el: HTMLButtonElement | null) => void;
  onMenuToggle: (index: number) => void;
};

export function AssistantCard({
  item,
  index,
  setButtonRef,
  onMenuToggle,
}: Props) {
  return (
    <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm transition-all p-3  ">
      {/* Header */}
      <div className=" pr-10">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
          {item.name}
        </h3>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" />
            {item.id}
          </span>
          <span>{item.personality}</span>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        <ChargesSection charges={item.charges} />
        <SystemsSection systems={item.systems} />
        <SatisfactionSection satisfaction={item.satisfaction} />
      </div>

      {/* Menu button */}
      <button
        ref={(el) => setButtonRef(index, el)}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-lg hover:bg-gray-100 transition"
        onClick={(e) => {
          e.stopPropagation();
          onMenuToggle(index);
        }}
      >
        <EllipsisVertical className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

/* ---------------- Sections ---------------- */

function ChargesSection({ charges }: { charges?: any }) {
  return (
    <Section title="Charges">
      <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-6">
        <Metric
          icon={<PlugZap className="w-4 h-4" />}
          value={charges?.inUse ?? 0}
          label="In use"
          dotClass="bg-green-500"
        />
        <Metric
          icon={<PlugZap className="w-4 h-4" />}
          value={charges?.free ?? 0}
          label="Free"
          dotClass="bg-blue-400"
        />
        <Metric
          icon={<PlugZap className="w-4 h-4" />}
          value={charges?.offline ?? 0}
          label="Offline"
          dotClass="bg-gray-300"
        />
      </div>
    </Section>
  );
}

function SystemsSection({ systems }: { systems?: any }) {
  return (
    <Section
      title="Systems"
      className="lg:border-l lg:border-r lg:border-gray-100 lg:px-8"
    >
      <div className="space-y-3">
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
        <p className="text-xs text-gray-500">
          {satisfaction?.period ?? '—'}
        </p>
      </div>
    </Section>
  );
}

/* ---------------- Shared ---------------- */

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
      <h4 className="text-xs font-medium text-gray-500 mb-2">
        {title}
      </h4>
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
