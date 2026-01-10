'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadAssistantsFromStorage } from '@/app/features/assistants/storage/assistants.storage';

type Assistant = {
  id: string;
  name?: string;
  language?: string;
  personality?: string;
  tone?: string;
  [key: string]: any;
};

export function useTrainingAssistant(id: string) {
  const [assistant, setAssistant] = useState<Assistant | null>(null);

  const normalizedId = useMemo(() => (id ?? '').toString(), [id]);

  useEffect(() => {
    if (!normalizedId) return;

    const all = loadAssistantsFromStorage();
    const found = all.find((a: any) => a?.id?.toString() === normalizedId);

    setAssistant(found ?? null);
  }, [normalizedId]);

  return { assistant };
}
