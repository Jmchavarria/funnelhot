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
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 pr-10">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
          {item.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Hash className="w-4 h-4" />
            {item.id}
          </span>
          <span>{item.personality}</span>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <ChargesSection charges={item.charges} />
        <SystemsSection systems={item.systems} />
        <SatisfactionSection satisfaction={item.satisfaction} />
      </div>

      {/* Menu button */}
      <button
        ref={(el) => setButtonRef(index, el)}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-3 sm:p-2 rounded-lg hover:bg-gray-100 transition"
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
      <div className="flex justify-around sm:justify-start gap-6">
        <Metric
          icon={<PlugZap className="w-5 h-5" />}
          value={charges?.inUse ?? 0}
          label="In use"
          dotClass="bg-green-500"
        />
        <Metric
          icon={<PlugZap className="w-5 h-5" />}
          value={charges?.free ?? 0}
          label="Free"
          dotClass="bg-blue-400"
        />
        <Metric
          icon={<PlugZap className="w-5 h-5" />}
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
      <div className="space-y-4 text-center lg:text-left">
        <div>
          <div className="flex items-center justify-center lg:justify-start gap-2 text-green-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            {systems?.workStatus ?? '—'}
          </div>
          <p className="text-xs text-gray-500">Work status</p>
        </div>

        <div>
          <div className="flex items-center justify-center lg:justify-start gap-2 text-2xl font-bold text-gray-900">
            <BarChart3 className="w-5 h-5" />
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
    <Section title="Customers satisfaction">
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2 text-2xl font-bold text-gray-900">
          <ThumbsUp className="w-5 h-5" />
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
      <h4 className="text-sm font-medium text-gray-500 mb-3 text-center lg:text-left">
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
      <div className="flex items-center gap-1 text-xl sm:text-2xl font-bold text-gray-900">
        {icon}
        {value}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        {label}
      </div>
    </div>
  );
}
