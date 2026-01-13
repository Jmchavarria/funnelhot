'use client';

import React from 'react';
import { EllipsisVertical, Globe, Sparkles } from 'lucide-react';
import { ChargesSection } from './ChargesSection';
import { SystemsSection } from './SystemsSection';
import { SatisfactionSection } from './SatisfactionSection';

type Assistant = any;

export function DesktopAssistantCard({
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
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h3>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            {item.language}
          </span>

          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {item.personality}
          </span>
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
        className="absolute top-3 cursor-pointer right-3 p-2 rounded-lg hover:bg-gray-100 transition"
        onClick={(e) => {
          e.stopPropagation();
          onMenuToggle(index);
        }}
        aria-label="Open menu"
      >
        <EllipsisVertical className="w-5 h-5 text-gray-600 " />
      </button>
    </div>
  );
}
