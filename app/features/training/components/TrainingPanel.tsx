'use client';

import { CornerDownLeft, Copy, FilePlus2, Lightbulb, Trash2, X } from 'lucide-react';

type Props = {
  trainingData: string;
  setTrainingData: (v: string) => void;
  trainingPrompts: string[];
  addPromptFromDraft: () => void;
  usePrompt: (p: string) => void;
  copyPrompt: (p: string) => void;
  deletePrompt: (idx: number) => void;
  clearDraft: () => void;
  showSuccess: boolean;
  setShowSuccess: (v: boolean) => void;
};

export const TrainingPanel = ({
  trainingData,
  setTrainingData,
  trainingPrompts,
  addPromptFromDraft,
  usePrompt,
  copyPrompt,
  deletePrompt,
  clearDraft,
  showSuccess,
  setShowSuccess,
}: Props) => {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-lg p-5 sm:p-6 flex flex-col min-h-0">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Training</h2>
      </div>

      <p className="text-xs text-gray-500 mb-3 sm:mb-4 leading-relaxed">
        Save training prompts. They appear here and are stored locally.
      </p>

      {/* Prompts list */}
      {trainingPrompts.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Saved prompts
          </p>

          <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-2 space-y-2">
            {trainingPrompts.map((p, idx) => (
              <div
                key={`${idx}-${p.slice(0, 20)}`}
                className="rounded-xl bg-white border border-gray-100 p-3 shadow-sm"
              >
                <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">{p}</p>

                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => usePrompt(p)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  >
                    Use
                  </button>

                  <button
                    onClick={() => copyPrompt(p)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition inline-flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>

                  <button
                    onClick={() => deletePrompt(idx)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      <textarea
        value={trainingData}
        onChange={(e) => setTrainingData(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            addPromptFromDraft();
          }
        }}
        placeholder={
          "Write a training prompt and save it.\n\nTip: Ctrl + Enter to save.\n\nExample:\nYou are a customer support assistant..."
        }
        className="flex-1 min-h-64 md:min-h-0 w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all bg-gray-50"
      />

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <button
          onClick={addPromptFromDraft}
          disabled={!trainingData.trim()}
          className="w-full cursor-pointer flex gap-2 items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-[0.98]"
        >
          <FilePlus2 className="w-5 h-5" />
          Save prompt
        </button>

        <button
          onClick={clearDraft}
          disabled={!trainingData.trim()}
          className="w-full cursor-pointer flex gap-2 items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-bold rounded-xl transition-all active:scale-[0.98]"
        >
          <X className="w-5 h-5" />
          Clear
        </button>
      </div>

      <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-2">
        <CornerDownLeft className="w-3.5 h-3.5" />
        Tip: <span className="font-semibold">Ctrl + Enter</span> to save the prompt
      </p>

      {/* Toast */}
      {showSuccess && (
        <div className="fixed z-50 top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto sm:w-90">
          <div className="flex items-start gap-3 rounded-2xl bg-green-600 px-4 py-3 shadow-xl text-white border border-green-700">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-green-500 shrink-0">
              <span className="text-white text-lg font-bold">✓</span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug">Saved</p>
              <p className="text-xs text-green-100">Prompt saved successfully.</p>
            </div>

            <button
              onClick={() => setShowSuccess(false)}
              className="ml-1 rounded-lg px-2 py-1 text-white hover:bg-green-500 shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
