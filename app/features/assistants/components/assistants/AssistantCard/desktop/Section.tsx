'use client';

import React from 'react';

export function Section({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className="text-xs font-medium text-gray-500 mb-2">{title}</h4>
      {children}
    </div>
  );
}
