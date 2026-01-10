'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAssistantTraining, saveAssistantTraining } from '@/app/features/training/storage/trainingStorage';
import { readLS, removeLS, writeLS } from '../utils/storage';

export const useTraining = (id: string) => {
  const promptsKey = useMemo(() => `training_prompts_${id}`, [id]);
  const draftKey = useMemo(() => `training_draft_${id}`, [id]);

  const [trainingData, setTrainingData] = useState('');
  const [trainingPrompts, setTrainingPrompts] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const toastSaved = useCallback((ms = 1500) => {
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), ms);
  }, []);

  const persistPrompts = useCallback(
    (next: string[]) => {
      setTrainingPrompts(next);
      writeLS(promptsKey, next);
      saveAssistantTraining(id, next);
    },
    [id, promptsKey]
  );

  // Load prompts + draft
  useEffect(() => {
    if (!id) return;

    const fromHelper = getAssistantTraining(id) ?? [];
    const fromLS = readLS<string[]>(promptsKey, []);
    const merged = (fromLS.length ? fromLS : fromHelper).filter(Boolean);

    setTrainingPrompts(merged);
    setTrainingData(readLS<string>(draftKey, ''));
  }, [id, promptsKey, draftKey]);

  // Persist draft while typing
  useEffect(() => {
    if (!id) return;

    if (trainingData) localStorage.setItem(draftKey, trainingData);
    else localStorage.removeItem(draftKey);
  }, [trainingData, id, draftKey]);

  const addPromptFromDraft = useCallback(() => {
    const value = trainingData.trim();
    if (!value) return;

    const next = [value, ...trainingPrompts.filter((p) => p !== value)];
    persistPrompts(next);

    toastSaved(2500);
    setTrainingData('');
    removeLS(draftKey);
  }, [trainingData, trainingPrompts, persistPrompts, toastSaved, draftKey]);

  const usePrompt = useCallback((prompt: string) => {
    setTrainingData(prompt);
  }, []);

  const copyPrompt = useCallback(
    async (prompt: string) => {
      try {
        await navigator.clipboard.writeText(prompt);
        toastSaved(1200);
      } catch {}
    },
    [toastSaved]
  );

  const deletePrompt = useCallback(
    (idx: number) => {
      const next = trainingPrompts.filter((_, i) => i !== idx);
      persistPrompts(next);
    },
    [trainingPrompts, persistPrompts]
  );

  const clearDraft = useCallback(() => setTrainingData(''), []);

  return {
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
  };
};
