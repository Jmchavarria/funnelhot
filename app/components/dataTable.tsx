'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { NewAssistantModal } from './newAssistantModal';
import { PaginationFooter } from './pagination';
import { DataTableProps } from '../types';
import { AssistantCard } from './assistantCard';
import { TableHeader } from './tableHeader';
import { useAssistants } from '../hooks/useAssistants';
import { useFloatingMenu } from '../hooks/useFloatingMenu';
import { AssistantMenu } from './assistantMenu';

export const DataTable: React.FC<DataTableProps> = ({ title }) => {
  const router = useRouter();
  const itemsPerPage = 3;

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

  const { openMenuRow, menuPosition, dropdownRef, buttonRefs, toggleMenu, closeMenu } =
    useFloatingMenu();

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
      <div className="w-full px-3 sm:px-0">
        <div className="w-full max-w-4xl mx-auto">
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
                  onEdit={() => handleEdit(index)}
                  onDelete={() => handleDelete(index)}
                  onTrain={() => handleTrain(index)}
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

      {/* FAB Mobile */}
      <button
        type="button"
        onClick={openCreateModal}
        disabled={false}
        className="
    sm:hidden
    fixed bottom-5 right-5 z-[60]
    h-14 w-14 rounded-full
    bg-gray-900 text-white
    shadow-lg
    flex items-center justify-center
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-gray-300
  "
        aria-label="New Assistant"
      >
        <Plus className="w-6 h-6" />
      </button>

    </div>
  );

}