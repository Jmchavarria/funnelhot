'use client';

import React from 'react';
import { ThumbsUp } from 'lucide-react';
import { Section } from './Section';

export function SatisfactionSection({ satisfaction }: { satisfaction?: any }) {
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
