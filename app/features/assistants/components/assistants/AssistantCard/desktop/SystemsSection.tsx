'use client';

import React from 'react';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import { Section } from './Section';

export function SystemsSection({ systems }: { systems?: any }) {
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
