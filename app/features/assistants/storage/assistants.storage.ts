// utils/assistants.storage.ts
export const STORAGE_KEY_ASSISTANTS = 'assistants';

export function loadAssistantsFromStorage<T = any>(): T[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY_ASSISTANTS);
  return stored ? (JSON.parse(stored) as T[]) : [];
}

export function saveAssistantsToStorage<T = any>(assistants: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_ASSISTANTS, JSON.stringify(assistants));
}

export function clearAssistantsStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_ASSISTANTS);
}
