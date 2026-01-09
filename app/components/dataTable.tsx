'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, EllipsisVertical, Trash, SquarePen, Bot, PlugZap, Hash, ThumbsUp, CheckCircle2, BarChart3 } from 'lucide-react';

import { NewAssistantModal } from './NewAssistantModal';
import { PaginationFooter } from './pagination';
import { DataTableProps, SortConfig } from '../types';
import { useRouter } from 'next/navigation';
const STORAGE_KEY_ASSISTANTS = 'assistants';

export const DataTable: React.FC<DataTableProps> = ({
    title,
    columns,
    data,
    addLabel,
    actions,
}) => {
    const [assistants, setAssistants] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [openMenuRow, setOpenMenuRow] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [filterType, setFilterType] = useState<string>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssistantIndex, setEditingAssistantIndex] = useState<number | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    const itemsPerPage = 6;
    const router = useRouter()

    // Cargar asistentes del localStorage al montar
    useEffect(() => {
        loadAssistants();
    }, []);

    const loadAssistants = () => {
        const stored = localStorage.getItem(STORAGE_KEY_ASSISTANTS);
        if (stored) {
            setAssistants(JSON.parse(stored));
        }
    };

    // Cerrar dropdown al hacer click fuera o al hacer scroll
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuRow !== null) {
                const target = event.target as HTMLElement;
                if (!target.closest('.menu-dropdown') && !target.closest('.menu-button')) {
                    setOpenMenuRow(null);
                }
            }
        };

        const handleScroll = () => {
            if (openMenuRow !== null) {
                setOpenMenuRow(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [openMenuRow]);

    const handleNewAssistant = (newAssistant: any) => {
        if (editingAssistantIndex !== null) {
            // Modo edición
            const updatedAssistants = [...assistants];
            updatedAssistants[editingAssistantIndex] = {
                ...updatedAssistants[editingAssistantIndex],
                ...newAssistant,
            };
            setAssistants(updatedAssistants);
            localStorage.setItem(STORAGE_KEY_ASSISTANTS, JSON.stringify(updatedAssistants));
            setEditingAssistantIndex(null);
        } else {
            // Modo creación - generar nuevo ID
            const newAssistantWithId = {
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
            const updatedAssistants = [...assistants, newAssistantWithId];
            setAssistants(updatedAssistants);
            localStorage.setItem(STORAGE_KEY_ASSISTANTS, JSON.stringify(updatedAssistants));
        }
    };

    const handleEdit = (index: number) => {
        const globalIndex = (currentPage - 1) * itemsPerPage + index;
        setEditingAssistantIndex(globalIndex);
        setIsModalOpen(true);
        setOpenMenuRow(null);
    };

    const handleDelete = (index: number) => {
        const globalIndex = (currentPage - 1) * itemsPerPage + index;
        const updatedAssistants = assistants.filter((_, i) => i !== globalIndex);
        setAssistants(updatedAssistants);
        localStorage.setItem(STORAGE_KEY_ASSISTANTS, JSON.stringify(updatedAssistants));
        setOpenMenuRow(null);
    };


    const handleTrain = (index: number) => {
        const globalIndex = (currentPage - 1) * itemsPerPage + index;
        const assistant = assistants[globalIndex];

        router.push(`/train/${assistant.id}`);
        setOpenMenuRow(null);
    };


    const filteredData = useMemo(() => {
        if (!assistants || assistants.length === 0) return [];
        return assistants.filter(item =>
            Object.values(item).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [assistants, searchTerm]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key as string];
            const bVal = b[sortConfig.key as string];

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (key: string): void => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <div className="bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="overflow-hidden">
                    {/* Header */}
                    <div className="mb-6">
                        <div className='flex justify-between items-center mb-6'>
                            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                {title}
                            </h2>

                            <div className="flex gap-3">
                                {assistants.length > 0 && (
                                    <button
                                        onClick={() => {
                                            if (confirm('¿Estás seguro de eliminar todos los asistentes?')) {
                                                localStorage.removeItem(STORAGE_KEY_ASSISTANTS);
                                                setAssistants([]);
                                            }
                                        }}
                                        className="px-4 py-2 flex gap-2 items-center justify-center rounded-lg transition cursor-pointer bg-white text-red-600 border border-red-200 hover:bg-red-50"
                                    >
                                        Clear All
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setEditingAssistantIndex(null);
                                        setIsModalOpen(true);
                                    }}
                                    className="px-4 py-2 flex gap-2 items-center justify-center rounded-lg transition cursor-pointer bg-white text-gray-900 shadow-sm hover:bg-gray-50"
                                >
                                    New Assistant <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="space-y-4">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100"
                                >
                                    {/* Header de la card */}
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Hash className="w-4 h-4" />
                                                {item.id}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                {item.personality}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contenido principal */}
                                    <div className="grid grid-cols-3 gap-8">
                                        {/* Charges */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-4">Charges</h4>
                                            <div className="flex gap-6">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-1 text-2xl font-bold text-gray-900 mb-1">
                                                        <PlugZap className="w-5 h-5" />
                                                        {item.charges?.inUse}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                        In use
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-1 text-2xl font-bold text-gray-900 mb-1">
                                                        <PlugZap className="w-5 h-5" />
                                                        {item.charges?.free}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                        Free
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-1 text-2xl font-bold text-gray-900 mb-1">
                                                        <PlugZap className="w-5 h-5" />
                                                        {item.charges?.offline}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                                        Offline
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Systems */}
                                        <div className="border-l border-r border-gray-100 px-8">
                                            <h4 className="text-sm font-medium text-gray-500 mb-4">Systems</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center gap-2 text-green-600 font-medium mb-1">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        {item.systems?.workStatus}
                                                    </div>
                                                    <p className="text-xs text-gray-500">Work status</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-1">
                                                        <BarChart3 className="w-5 h-5" />
                                                        {item.systems?.fuelInStorage}%
                                                    </div>
                                                    <p className="text-xs text-gray-500">Fuel in storage</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Customer satisfaction */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-4">Customers satisfaction</h4>
                                            <div>
                                                <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-1">
                                                    <ThumbsUp className="w-5 h-5" />
                                                    {item.satisfaction?.percentage}%
                                                </div>
                                                <p className="text-xs text-gray-500">{item.satisfaction?.period}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botón de menú */}
                                    <button
                                        ref={(el) => { buttonRefs.current[index] = el; }}
                                        className="menu-button absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (openMenuRow === index) {
                                                setOpenMenuRow(null);
                                            } else {
                                                const button = buttonRefs.current[index];
                                                if (button) {
                                                    const rect = button.getBoundingClientRect();
                                                    setMenuPosition({
                                                        top: rect.bottom + 4,
                                                        left: rect.left - 120
                                                    });
                                                }
                                                setOpenMenuRow(index);
                                            }
                                        }}
                                    >
                                        <EllipsisVertical className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
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
                        onPrev={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        onNext={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    />

                </div>
            </div>

            {/* Menú flotante */}
            {openMenuRow !== null && (
                <div
                    ref={dropdownRef}
                    className="menu-dropdown fixed w-40 bg-white shadow-xl rounded-lg border border-gray-200 z-50 overflow-hidden"
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`
                    }}
                >
                    <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm transition flex items-center gap-2"
                        onClick={() => handleEdit(openMenuRow)}
                    >
                        <SquarePen className='w-4 h-4' />
                        <span>Editar</span>
                    </button>

                    <button
                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm transition flex items-center gap-2"
                        onClick={() => handleDelete(openMenuRow)}
                    >
                        <Trash className='w-4 h-4' />
                        <span>Eliminar</span>
                    </button>

                    <button
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm transition flex items-center gap-2"
                        onClick={() => handleTrain(openMenuRow)}
                    >
                        <Bot className='w-4 h-4' />
                        <span>Entrenar</span>
                    </button>
                </div>
            )}

            <NewAssistantModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingAssistantIndex(null);
                }}
                onSubmit={handleNewAssistant}
                initialData={editingAssistantIndex !== null ? assistants[editingAssistantIndex] : undefined}
            />
        </div>
    );
};