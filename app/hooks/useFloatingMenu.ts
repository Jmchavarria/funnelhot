// hooks/useFloatingMenu.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export function useFloatingMenu() {
  const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuRow === null) return;
      const target = event.target as HTMLElement;
      if (!target.closest('.menu-dropdown') && !target.closest('.menu-button')) {
        setOpenMenuRow(null);
      }
    };

    const handleScroll = () => {
      if (openMenuRow !== null) setOpenMenuRow(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [openMenuRow]);

  const toggleMenu = useCallback((index: number) => {
    if (openMenuRow === index) {
      setOpenMenuRow(null);
      return;
    }

    const button = buttonRefs.current[index];
    if (button) {
      const rect = button.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + 4, left: rect.left - 120 });
    }
    setOpenMenuRow(index);
  }, [openMenuRow]);

  const closeMenu = useCallback(() => setOpenMenuRow(null), []);

  return {
    openMenuRow,
    menuPosition,
    dropdownRef,
    buttonRefs,
    toggleMenu,
    closeMenu,
  };
}
