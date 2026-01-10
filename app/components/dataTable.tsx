'use client';

import React from 'react';
import { Plus, EllipsisVertical, Trash, SquarePen, Bot, PlugZap, Hash, ThumbsUp, CheckCircle2, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { NewAssistantModal } from './NewAssistantModal';
import { PaginationFooter } from './pagination';
import { DataTableProps } from '../types';
import { AssistantCard } from './assistantCard';
import { TableHeader } from './tableHeader';
import { useAssistants } from '../hooks/useAssistants';
import { useFloatingMenu } from '../hooks/useFloatingMenu';
import { AssistantMenu } from './assistantMenu';

export const DataTable: React.FC<DataTableProps> = ({ title }) => {
  const router = useRouter();
  const itemsPerPage = 6;

  const {
    assistants,
    currentPage,
    totalPages,
    isModalOpen,
    editingAssistantIndex,
    sortedData,
    paginatedData,
    setCurrentPage,
    openCreateModal,
    openEditModal,
    closeModal,
    upsertAssistant,
    deleteAssistant,
    clearAll,
  } = useAssistants(itemsPerPage);

  const {
    openMenuRow,
    menuPosition,
    dropdownRef,
    buttonRefs,
    toggleMenu,
    closeMenu,
  } = useFloatingMenu();

  const toGlobalIndex = (indexInPage: number) => (currentPage - 1) * itemsPerPage + indexInPage;

  const handleEdit = (indexInPage: number) => {
    openEditModal(toGlobalIndex(indexInPage));
    closeMenu();
  };

  const handleDelete = (indexInPage: number) => {
    deleteAssistant(toGlobalIndex(indexInPage));
    closeMenu();
  };

  const handleTrain = (indexInPage: number) => {
    const assistant = assistants[toGlobalIndex(indexInPage)];
    if (!assistant?.id) return;
    router.push(`/train/${assistant.id}`);
    closeMenu();
  };

 return (
  <div className="bg-gray-50 w-full">
    {/* Contenedor: full width en mobile, centrado y limitado en desktop */}
    <div className="w-full ">

      {/* Espaciado vertical */}
      <div className=" ">
        {/* Header */}
        <TableHeader
          title={title}
          hasItems={assistants.length > 0}
          onClearAll={clearAll}
          onNew={openCreateModal}
        />

        {/* Cards */}
        <div className="space-y-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <AssistantCard
                key={item.id || index}
                item={item}
                index={index}
                setButtonRef={(i, el) => {
                  buttonRefs.current[i] = el;
                }}
                onMenuToggle={(i) => toggleMenu(i)}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-gray-500">No se encontraron resultados</p>
            </div>
          )}
        </div>

        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          itemsPerPage={itemsPerPage}
          onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
    </div>

    {/* Floating menu */}
    <AssistantMenu
      open={openMenuRow !== null}
      top={menuPosition.top}
      left={menuPosition.left}
      menuRef={dropdownRef}
      onEdit={() => {
        if (openMenuRow === null) return;
        handleEdit(openMenuRow);
      }}
      onDelete={() => {
        if (openMenuRow === null) return;
        handleDelete(openMenuRow);
      }}
      onTrain={() => {
        if (openMenuRow === null) return;
        handleTrain(openMenuRow);
      }}
    />

    <NewAssistantModal
      open={isModalOpen}
      onClose={closeModal}
      onSubmit={upsertAssistant}
      initialData={editingAssistantIndex !== null ? assistants[editingAssistantIndex] : undefined}
    />
  </div>
);

}