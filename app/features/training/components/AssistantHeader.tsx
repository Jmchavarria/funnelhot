'use client';

import { ArrowLeft, Globe, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Assistant = {
  id: string;
  name?: string;
  language?: string;
  personality?: string;
  tone?: string;
};

export const AssistantHeader = ({
  id,
  assistant,
}: {
  id: string;
  assistant: Assistant | null;
}) => {
  const router = useRouter();

  return (
    <>
      {/* Back */}
      <div className="w-full max-w-5xl mt-6 sm:mt-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="w-full max-w-2xl mt-6 sm:mt-8 border border-gray-200 rounded-xl p-5 sm:p-8 bg-white shadow-sm mb-6 sm:mb-8">
        {assistant ? (
          <div className="text-center space-y-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {assistant.name || 'Assistant'}
            </h1>

            <div className="flex flex-wrap justify-center gap-2">
              <span className="inline-flex gap-1.5 items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
                <Globe className="w-3.5 h-3.5" /> {assistant.language || '—'}
              </span>

              <span className="inline-flex gap-1.5 items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
                <Sparkles className="w-3.5 h-3.5" />{' '}
                {assistant.personality || assistant.tone || '—'}
              </span>
            </div>

            <p className="text-gray-500 font-mono text-xs break-all pt-1">ID: {id}</p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm sm:text-base text-center">Assistant not found</p>
        )}
      </div>
    </>
  );
};
