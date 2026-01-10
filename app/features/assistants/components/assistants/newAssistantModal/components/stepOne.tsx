// app/features/assistants/components/newAssistantModal/components/StepOne.tsx
'use client';

import React from 'react';
import type { AssistantForm } from '../types';

type Props = {
  form: AssistantForm;
  setForm: React.Dispatch<React.SetStateAction<AssistantForm>>;
  nameLength: number;
  showNameError: boolean;
  nameError: string;
  MAX_NAME: number;
  MIN_NAME: number;
  onNameChange: (value: string) => void;
  onNameBlur: () => void;
};

export function StepOne({
  form,
  setForm,
  nameLength,
  showNameError,
  nameError,
  MAX_NAME,
  MIN_NAME,
  onNameChange,
  onNameBlur,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-end justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Assistant name</label>
          <span className={`text-xs ${nameLength > MAX_NAME ? 'text-red-600' : 'text-gray-400'}`}>
            {nameLength}/{MAX_NAME}
          </span>
        </div>

        <input
          value={form.name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={onNameBlur}
          className={[
            'w-full px-4 py-2 rounded-lg transition border',
            showNameError
              ? 'border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200'
              : 'border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200',
          ].join(' ')}
          placeholder="e.g. Sales Assistant"
          maxLength={MAX_NAME + 20}
        />

        {showNameError ? (
          <p className="mt-1 text-xs text-red-600">{nameError}</p>
        ) : (
          <p className="mt-1 text-xs text-gray-400">Use a short, clear name (min {MIN_NAME} chars).</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
        <select
          value={form.language}
          onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        >
          <option>Spanish</option>
          <option>English</option>
          <option>Portuguese</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
        <select
          value={form.tone}
          onChange={(e) => setForm((p) => ({ ...p, tone: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        >
          <option>Formal</option>
          <option>Casual</option>
          <option>Professional</option>
          <option>Friendly</option>
        </select>
      </div>
    </div>
  );
}
