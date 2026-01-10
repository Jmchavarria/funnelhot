// app/features/assistants/components/newAssistantModal/components/StepTwo.tsx
'use client';

import React from 'react';
import type { AssistantForm } from '../types';

type Props = {
  form: AssistantForm;
  setForm: React.Dispatch<React.SetStateAction<AssistantForm>>;
  totalResponses: number;
  isStep2Valid: boolean;
};

export function StepTwo({ form, setForm, totalResponses, isStep2Valid }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          Response length distribution (must total 100%)
        </p>

        {(['short', 'medium', 'long'] as const).map((key) => (
          <div key={key} className="flex items-center gap-3 mb-3">
            <span className="w-20 text-sm capitalize">{key}</span>
            <input
              type="number"
              min={0}
              max={100}
              value={form[key]}
              onChange={(e) => setForm((p) => ({ ...p, [key]: Number(e.target.value) }))}
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        ))}

        <p className={`text-sm ${isStep2Valid ? 'text-green-600' : 'text-red-500'}`}>
          Total: {totalResponses}%
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Enable audio responses</span>
        <input
          type="checkbox"
          checked={form.audioEnabled}
          onChange={(e) => setForm((p) => ({ ...p, audioEnabled: e.target.checked }))}
          className="h-4 w-4"
        />
      </div>
    </div>
  );
}
