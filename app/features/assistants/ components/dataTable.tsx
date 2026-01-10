'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { NewAssistantModal } from './newAssistantModal';
import { PaginationFooter } from '@/app/shared/components/pagination';
import { DataTableProps } from '@/app/types';
import { AssistantCard } from './assistantCard';
import { TableHeader } from './tableHeader';
import { useAssistants } from '../hooks/useAssistants';
import { useFloatingMenu } from '@/app/hooks/useFloatingMenu';
import { AssistantMenu } from './assistantMenu';

type ToastKind = 'success' | 'danger';

type ToastState = {
  open: boolean;
  title: string;
  kind: ToastKind;
};

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

    // ✅ NEW (from hook)
    lastAction,
    clearLastAction,
  } = useAssistants(itemsPerPage);

  const { openMenuRow, menuPosition, dropdownRef, buttonRefs, toggleMenu, closeMenu } =
    useFloatingMenu();

  // ✅ one toast for all actions
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: '',
    kind: 'success',
  });

  // ✅ Whenever hook triggers an action, show toast
  useEffect(() => {
    if (!lastAction) return;

    const msg = (() => {
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
      title: msg,
      kind: lastAction.type === 'cleared' ? 'danger' : 'success',
    });

    // auto close
    const t = setTimeout(() => {
      setToast((p) => ({ ...p, open: false }));
    }, 2000);

    // clear action so it doesn't re-fire
    clearLastAction();

    return () => clearTimeout(t);
  }, [lastAction, clearLastAction]);

  const toGlobalIndex = (indexInPage: number) =>
    (currentPage - 1) * itemsPerPage + indexInPage;

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

  const toastStyles = useMemo(() => {
    if (toast.kind === 'danger') {
      return {
        wrap: 'bg-red-600 text-white border border-red-700',
        dot: 'bg-red-500',
      };
    }
    return {
      wrap: 'bg-green-600 text-white border border-green-700',
      dot: 'bg-green-500',
    };
  }, [toast.kind]);

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
                <p className="text-gray-500">No results found</p>
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
        initialData={
          editingAssistantIndex !== null ? assistants[editingAssistantIndex] : undefined
        }
      />

      {/* ✅ Unified Toast */}
      {toast.open && (
        <div className="fixed z-80 top-4 right-4">
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg ${toastStyles.wrap}`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${toastStyles.dot}`}>
              ✓
            </div>
            <p className="text-sm font-medium">{toast.title}</p>
          </div>
        </div>
      )}

      {/* FAB Mobile */}
      <button
        type="button"
        onClick={openCreateModal}
        className="
          sm:hidden fixed bottom-5 right-5 z-60
          h-14 w-14 rounded-full bg-gray-900 text-white shadow-lg
          flex items-center justify-center active:scale-95
          focus:outline-none focus:ring-2 focus:ring-gray-300
        "
        aria-label="New Assistant"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
