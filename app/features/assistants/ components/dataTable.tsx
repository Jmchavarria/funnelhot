'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { NewAssistantModal } from './newAssistantModal';
import { PaginationFooter } from '../../../shared/components/pagination';
import { DataTableProps } from '../../../types';
import { AssistantCard } from './assistantCard';
import { TableHeader } from './tableHeader';
import { useAssistants } from '../hooks/useAssistants';
import { useFloatingMenu } from '../../../hooks/useFloatingMenu';
import { AssistantMenu } from './assistantMenu';
import { SearchBar } from '../../../shared/components/searchBar';

export const DataTable: React.FC<DataTableProps> = ({ title }) => {
  const router = useRouter();
  const itemsPerPage = 3;

  const {
    assistants,
    currentPage,
    isModalOpen,
    editingAssistantIndex,
    sortedData,
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

  // ✅ Search state
  const [query, setQuery] = useState('');

  // Helpers
  const norm = (v: unknown) =>
    String(v ?? '')
      .toLowerCase()
      .trim();

  const matches = (assistant: any, q: string) => {
    if (!q) return true;

    // agrega campos relevantes aquí
    const haystack = [
      assistant?.name,
      assistant?.id,
      assistant?.language,
      assistant?.personality,
      assistant?.tone,
      assistant?.systems?.workStatus,
      assistant?.systems?.fuelInStorage,
      assistant?.satisfaction?.percentage,
      assistant?.satisfaction?.period,
      assistant?.charges?.inUse,
      assistant?.charges?.free,
      assistant?.charges?.offline,
    ]
      .map(norm)
      .join(' ');

    return haystack.includes(q);
  };

  // ✅ Filtered data (based on sorted list from hook)
  const filteredData = useMemo(() => {
    const q = norm(query);
    return (sortedData ?? []).filter((a: any) => matches(a, q));
  }, [sortedData, query]);

  // ✅ total pages based on filtered results
  const totalPagesFiltered = useMemo(() => {
    return Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData.length, itemsPerPage]);

  // ✅ clamp current page if search reduces pages
  useEffect(() => {
    if (currentPage > totalPagesFiltered) {
      setCurrentPage(totalPagesFiltered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPagesFiltered]);

  // ✅ paginated filtered data
  const paginatedFilteredData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, itemsPerPage]);

  const toGlobalIndexFromFiltered = (indexInPage: number) => {
    const globalInFiltered = (currentPage - 1) * itemsPerPage + indexInPage;
    const item = filteredData[globalInFiltered];
    if (!item) return -1;

    // buscamos el índice real dentro de assistants (source of truth para editar/eliminar)
    const realIndex = assistants.findIndex((a: any) => a?.id === item?.id);
    return realIndex;
  };

  const handleEdit = (indexInPage: number) => {
    const realIndex = toGlobalIndexFromFiltered(indexInPage);
    if (realIndex < 0) return;
    openEditModal(realIndex);
    closeMenu();
  };

  const handleDelete = (indexInPage: number) => {
    const realIndex = toGlobalIndexFromFiltered(indexInPage);
    if (realIndex < 0) return;
    deleteAssistant(realIndex);
    closeMenu();
  };

  const handleTrain = (indexInPage: number) => {
    const realIndex = toGlobalIndexFromFiltered(indexInPage);
    if (realIndex < 0) return;

    const assistant = assistants[realIndex];
    if (!assistant?.id) return;

    router.push(`/train/${assistant.id}`);
    closeMenu();
  };

  return (
    <div className="bg-gray-50 w-full">
      <div className="w-full px-3 sm:px-0">
        <div className="w-full max-w-4xl mx-auto">
          <TableHeader
            title={title}
            hasItems={assistants.length > 0}
            onClearAll={clearAll}
            onNew={openCreateModal}
          />

          {/* ✅ Search */}
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              setCurrentPage(1); // reset a página 1 cuando cambias el filtro
            }}
            placeholder="Search assistants..."
            className="mb-4"
          />

          {/* Cards */}
          <div className="space-y-4">
            {paginatedFilteredData.length > 0 ? (
              paginatedFilteredData.map((item: any, index: number) => (
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
                <p className="text-gray-500">No results found</p>
              </div>
            )}
          </div>

          <PaginationFooter
            currentPage={currentPage}
            totalPages={totalPagesFiltered}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(totalPagesFiltered, p + 1))}
          />
        </div>
      </div>

      {/* Floating menu (desktop) */}
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
};
