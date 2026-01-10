'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { NewAssistantModal } from './newAssistantModal';
import { PaginationFooter } from '@/app/shared/components/pagination';
import { DataTableProps } from '@/app/types';

// ⚠️ IMPORT CON ESPACIOS: esto te puede romper el build.
// ✅ Debe ser un path real SIN dobles espacios en el nombre de carpeta.
// Ej: './assistants/AssistantCard/AssistantCard'
import { AssistantCard } from './assistants/AssistantCard/AssistantCard';

import { TableHeader } from './tableHeader';
import { useAssistants } from '../hooks/useAssistants';
import { useFloatingMenu } from '@/app/hooks/useFloatingMenu';
import { AssistantMenu } from './assistantMenu';
import { SearchBar } from '@/app/shared/components/searchBar';

type ToastKind = 'success' | 'danger';

type ToastState = {
  open: boolean;
  title: string;
  kind: ToastKind;
};

export const DataTable: React.FC<DataTableProps> = ({ title }) => {
  const router = useRouter();

  // Cambiar esto afecta: paginación, index global, y cálculo de totalPages.
  const itemsPerPage = 3;

  const [search, setSearch] = useState('');

  /**
   * useAssistants es tu "source of truth" para la data de assistants:
   * - carga/persistencia
   * - sorting base
   * - paginación base (currentPage)
   * - CRUD
   * - modal de create/edit
   * - lastAction para toasts
   */
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

  /**
   * Maneja el menú flotante "..." en desktop:
   * - openMenuRow: índice del item que tiene menú abierto
   * - menuPosition: coords (top/left) calculadas con el button ref
   * - dropdownRef: para cerrar cuando haces click afuera
   * - buttonRefs: para saber dónde está el botón de cada fila
   */
  const {
    openMenuRow,
    menuPosition,
    dropdownRef,
    buttonRefs,
    toggleMenu,
    closeMenu,
  } = useFloatingMenu();

  /* ---------------- Toast ---------------- */

  // El toast se controla por un estado local. lastAction solo dispara el evento.
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: '',
    kind: 'success',
  });

  /**
   * Este efecto convierte "eventos" (lastAction) en UI (toast).
   * Importante: luego llama clearLastAction() para que NO se repita al re-render.
   */
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
      kind: lastAction.type === 'cleared' ? 'danger' : 'success',
    });

    // Auto-close del toast
    const t = setTimeout(() => {
      setToast((p) => ({ ...p, open: false }));
    }, 2200);

    clearLastAction();
    return () => clearTimeout(t);
  }, [lastAction, clearLastAction]);

  /**
   * Estilos derivados del tipo de toast.
   * useMemo evita recrear objetos (no es crítico, pero es limpio).
   */
  const toastStyles = useMemo(() => {
    return toast.kind === 'danger'
      ? {
          wrap: 'bg-red-600 text-white border border-red-700',
          dot: 'bg-red-500',
        }
      : {
          wrap: 'bg-emerald-600 text-white border border-emerald-700',
          dot: 'bg-emerald-500',
        };
  }, [toast.kind]);

  /* ---------------- Search + Filter ---------------- */

  /**
   * Filtra sobre sortedData (ya viene ordenado del hook).
   * OJO: Esto cambia el tamaño del dataset y por eso recalculamos paginación (totalPages/paginatedData).
   */
  const filteredData = useMemo(() => {
    if (!search.trim()) return sortedData;

    const q = search.toLowerCase();

    // Se filtran campos relevantes y se hace un includes()
    return sortedData.filter((a: any) =>
      [a.name, a.id, a.language, a.personality, a.tone]
        .filter(Boolean)
        .some((field: string) => field.toLowerCase().includes(q))
    );
  }, [sortedData, search]);

  /**
   * UX: cuando cambias el search, vuelves a page=1.
   * Evita escenarios tipo: estabas en page 3 y con filtro solo queda 1 página.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, setCurrentPage]);

  // totalPages depende del dataset filtrado
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  /**
   * Cortamos el array filtrado para mostrar solo la página actual.
   */
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  /* ---------------- Actions ---------------- */

  /**
   * Convierte índice de la página (0..itemsPerPage-1) a índice global.
   * Esto solo es válido si estás operando sobre el dataset global NO filtrado.
   */
  const toGlobalIndex = (indexInPage: number) =>
    (currentPage - 1) * itemsPerPage + indexInPage;

  /**
   * Abre el modal en modo edición usando index global,
   * y cierra el menú flotante (si está abierto).
   */
  const handleEdit = (indexInPage: number) => {
    openEditModal(toGlobalIndex(indexInPage));
    closeMenu();
  };

  /**
   * Borra por index global y cierra menú flotante.
   */
  const handleDelete = (indexInPage: number) => {
    deleteAssistant(toGlobalIndex(indexInPage));
    closeMenu();
  };

  /**
   * ⚠️ POSIBLE BUG:
   * Estás usando filteredData[toGlobalIndex(index)].
   * Cuando hay filtro, el "índice global" ya no coincide con el array filtrado.
   *
   * ✅ Solución recomendada: usar directamente item.id desde el map
   * (te lo dejo comentado abajo).
   */
  const handleTrain = (indexInPage: number) => {
    const assistant = filteredData[toGlobalIndex(indexInPage)];
    if (!assistant?.id) return;

    router.push(`/train/${assistant.id}`);
    closeMenu();
  };

  /* ---------------- Render ---------------- */

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

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre, idioma, personalidad o ID…"
            className="mb-4"
          />

          <div className="space-y-4">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, indexInPage) => (
                <AssistantCard
                  key={item.id || indexInPage}
                  item={item}
                  index={indexInPage}
                  /**
                   * Guardamos la ref del botón "..." por índice de página.
                   * Esto se usa para posicionar el dropdown.
                   */
                  setButtonRef={(i, el) => {
                    buttonRefs.current[i] = el;
                  }}
                  onMenuToggle={(i) => toggleMenu(i)}
                  onEdit={() => handleEdit(indexInPage)}
                  onDelete={() => handleDelete(indexInPage)}
                  onTrain={() => handleTrain(indexInPage)}

                  /**
                   * ✅ Mejor alternativa (sin bug):
                   * onTrain={() => item?.id && router.push(`/train/${item.id}`)}
                   * (así no dependes de indices globales con filtros)
                   */
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
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>

      {/* Menú flotante: usa openMenuRow (índice de página) y coords calculadas */}
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
        /**
         * initialData se usa para "editar": tomas el índice del hook (global),
         * no el índice de la página.
         */
        initialData={
          editingAssistantIndex !== null ? assistants[editingAssistantIndex] : undefined
        }
      />

      {/* Toast simple: solo muestra feedback visual de acciones */}
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

      {/* FAB móvil: acceso rápido a "New Assistant" */}
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
