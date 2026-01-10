'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { NewAssistantModal } from './assistants/newAssistantModal/newAssistantModal';
import { PaginationFooter } from '@/app/shared/components/pagination';
import { DataTableProps } from '@/app/types';
import { AssistantCard } from './assistants/AssistantCard/AssistantCard';
import { TableHeader } from './tableHeader';
import { useAssistants } from '../hooks/useAssistants';
import { useFloatingMenu } from '@/app/hooks/useFloatingMenu';
import { AssistantMenu } from './assistantMenu';
import { SearchBar } from '@/app/shared/components/searchBar';
import { Toast } from './toast';

type ToastKind = 'success' | 'danger';

type ToastState = {
  open: boolean;
  title: string;
  kind: ToastKind;
};

export const DataTable: React.FC<DataTableProps> = ({ title }) => {
  const router = useRouter();
  const itemsPerPage = 3;

  const [search, setSearch] = useState('');

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
    lastAction,
    clearLastAction,
  } = useAssistants(itemsPerPage);

  const {
    openMenuRow,
    menuPosition,
    dropdownRef,
    buttonRefs,
    toggleMenu,
    closeMenu,
  } = useFloatingMenu();

  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: '',
    kind: 'success',
  });

  useEffect(() => {
    if (!lastAction) return;

    const title = (() => {
      switch (lastAction.type) {
        case 'created':
          return `Assistant created${lastAction.name ? `: ${lastAction.name}` : ''}`;
        case 'updated':
          return `Assistant updated${lastAction.name ? `: ${lastAction.name}` : ''}`;
        case 'deleted':
          return `Assistant deleted${lastAction.name ? `: ${lastAction.name}` : ''}`;
        case 'cleared':
          return 'All assistants deleted';
        default:
          return '';
      }
    })();

    setToast({
      open: true,
      title,
      kind:
        lastAction.type === 'deleted' || lastAction.type === 'cleared'
          ? 'danger'
          : 'success',
    });

    const t = setTimeout(() => {
      setToast((p) => ({ ...p, open: false }));
    }, 2200);

    clearLastAction();
    return () => clearTimeout(t);
  }, [lastAction, clearLastAction]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return sortedData;
    const q = search.toLowerCase();

    return sortedData.filter((a: any) =>
      [a.name, a.id, a.language, a.personality, a.tone]
        .filter(Boolean)
        .some((field: string) => field.toLowerCase().includes(q))
    );
  }, [sortedData, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, setCurrentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const toGlobalIndex = (indexInPage: number) =>
    (currentPage - 1) * itemsPerPage + indexInPage;

  const handleEdit = (index: number) => {
    openEditModal(toGlobalIndex(index));
    closeMenu();
  };

  const handleDelete = (index: number) => {
    deleteAssistant(toGlobalIndex(index));
    closeMenu();
  };

  const handleTrain = (index: number) => {
    const assistant = filteredData[toGlobalIndex(index)];
    if (!assistant?.id) return;
    router.push(`/train/${assistant.id}`);
    closeMenu();
  };

  return (
    <div className="bg-gray-50 w-full pb-16 sm:pb-0">
      <div className="w-full px-3 sm:px-0">
        <div className="w-full max-w-4xl mx-auto">
          <TableHeader
            title={title}
            hasItems={assistants.length > 0}
            onClearAll={clearAll}
            onNew={openCreateModal}
          />

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre, idioma, personalidad o ID…"
            className="mb-4"
          />

          <div className="space-y-4">
            {paginatedData.map((item, index) => (
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
            ))}
          </div>

          <PaginationFooter
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>

      <AssistantMenu
        open={openMenuRow !== null}
        top={menuPosition.top}
        left={menuPosition.left}
        menuRef={dropdownRef}
        onEdit={() => openMenuRow !== null && handleEdit(openMenuRow)}
        onDelete={() => openMenuRow !== null && handleDelete(openMenuRow)}
        onTrain={() => openMenuRow !== null && handleTrain(openMenuRow)}
      />

      <NewAssistantModal
        open={isModalOpen}
        onClose={closeModal}
        onSubmit={upsertAssistant}
        initialData={
          editingAssistantIndex !== null
            ? assistants[editingAssistantIndex]
            : undefined
        }
      />

      <Toast
        open={toast.open}
        title={toast.title}
        kind={toast.kind}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      />

      <button
        type="button"
        onClick={openCreateModal}
        className="sm:hidden fixed bottom-5 right-5 z-60 h-14 w-14 rounded-full bg-gray-900 text-white shadow-lg flex items-center justify-center active:scale-95"
        aria-label="New Assistant"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
