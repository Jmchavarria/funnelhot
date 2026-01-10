// app/features/assistants/components/newAssistantModal/components/StepIndicator.tsx
'use client';

import React from 'react';
import type { Step } from '../types';

export function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center mb-8">
      <div
        className={[
          'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
          step === 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600',
        ].join(' ')}
      >
        1
      </div>
      <div className="flex-1 h-px bg-gray-300 mx-3" />
      <div
        className={[
          'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
          step === 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600',
        ].join(' ')}
      >
        2
      </div>
    </div>
  );
}
