'use client';

export const safeJSONParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const readLS = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  return safeJSONParse<T>(window.localStorage.getItem(key), fallback);
};

export const writeLS = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const removeLS = (key: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
};
