'use client';

import React from 'react';
import { MobileAssistantRow } from './mobile/MobileAssistantRow';
import { DesktopAssistantCard } from './desktop/DesktopAssistantCard';


type Assistant = any;

type Props = {
  item: Assistant;
  index: number;

  // Desktop dropdown
  setButtonRef: (index: number, el: HTMLButtonElement | null) => void;
  onMenuToggle: (index: number) => void;

  // Mobile inline actions
  onEdit: () => void;
  onDelete: () => void;
  onTrain: () => void;
};

export function AssistantCard({
  item,
  index,
  setButtonRef,
  onMenuToggle,
  onEdit,
  onDelete,
  onTrain,
}: Props) {
  return (
    <>
      {/* MOBILE */}
      <div className="sm:hidden w-full">
        <MobileAssistantRow item={item} onEdit={onEdit} onDelete={onDelete} onTrain={onTrain} />
      </div>

      {/* DESKTOP/TABLET */}
      <div className="hidden sm:block w-full">
        <DesktopAssistantCard item={item} index={index} setButtonRef={setButtonRef} onMenuToggle={onMenuToggle} />
      </div>
    </>
  );
}
