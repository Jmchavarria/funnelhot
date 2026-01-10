// hooks/useAssistants.ts
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';


import { loadAssistantsFromStorage, clearAssistantsStorage, saveAssistantsToStorage } from '../storage/assistants.storage';
type SortDirection = 'asc' | 'desc';

export type SortConfig = { key: string | null; direction: SortDirection };

function defaultEnrichAssistant(newAssistant: any) {
    return {
        ...newAssistant,
        id: Date.now().toString(),
        personality: newAssistant.tone || 'Professional',
        charges: {
            inUse: Math.floor(Math.random() * 10),
            free: Math.floor(Math.random() * 20),
            offline: Math.floor(Math.random() * 5),
        },
        systems: {
            workStatus: 'Operational',
            fuelInStorage: Math.floor(Math.random() * 100),
        },
        satisfaction: {
            percentage: Math.floor(Math.random() * 100),
            period: 'Last 30 days',
        },
    };
}

export function useAssistants(itemsPerPage: number) {
    const [assistants, setAssistants] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssistantIndex, setEditingAssistantIndex] = useState<number | null>(null);

    useEffect(() => {
        setAssistants(loadAssistantsFromStorage());
    }, []);

    const persist = useCallback((next: any[]) => {
        setAssistants(next);
        saveAssistantsToStorage(next);
    }, []);

    const filteredData = useMemo(() => {
        if (!assistants.length) return [];
        const term = searchTerm.toLowerCase();

        return assistants.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().toLowerCase().includes(term)
            )
        );
    }, [assistants, searchTerm]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        const { key, direction } = sortConfig;
        return [...filteredData].sort((a, b) => {
            const aVal = a[key as string];
            const bVal = b[key as string];
            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(start, start + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    // Ajuste si borras cosas y quedas en una página vacía
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    const handleSort = useCallback((key: string) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    const openCreateModal = useCallback(() => {
        setEditingAssistantIndex(null);
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((globalIndex: number) => {
        setEditingAssistantIndex(globalIndex);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingAssistantIndex(null);
    }, []);

    const upsertAssistant = useCallback(
        (newAssistant: any) => {
            if (editingAssistantIndex !== null) {
                const next = [...assistants];
                next[editingAssistantIndex] = { ...next[editingAssistantIndex], ...newAssistant };
                persist(next);
                setEditingAssistantIndex(null);
                return;
            }

            const enriched = defaultEnrichAssistant(newAssistant);
            persist([...assistants, enriched]);
        },
        [assistants, editingAssistantIndex, persist]
    );

    const deleteAssistant = useCallback(
        (globalIndex: number) => {
            const next = assistants.filter((_, i) => i !== globalIndex);
            persist(next);
        },
        [assistants, persist]
    );

    const clearAll = useCallback(() => {
        clearAssistantsStorage();
        setAssistants([]);
        setCurrentPage(1);
    }, []);

    return {
        // state
        assistants,
        searchTerm,
        sortConfig,
        currentPage,
        totalPages,
        isModalOpen,
        editingAssistantIndex,

        // computed
        sortedData,
        paginatedData,

        // setters/actions
        setSearchTerm,
        setCurrentPage,
        handleSort,
        openCreateModal,
        openEditModal,
        closeModal,
        upsertAssistant,
        deleteAssistant,
        clearAll,
    };
}
