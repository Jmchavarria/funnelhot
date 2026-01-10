'use client';

export function Dot({ color }: { color: string }) {
  return <span className={`w-2 h-2 rounded-full ${color}`} />;
}
