export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    key: string | null;
    direction: SortDirection;
}

export interface ColumnConfig {
    key: string;
    label: string;
    sortable?: boolean;
}

export interface DataProp {
    id: string;
    name: string;
    language: string;
    personality: string;
    charges?: {
        inUse?: number;
        free?: number;
        offline?: number;
    };
    systems?: {
        workStatus?: 'All operational' | 'En entrenamiento' | 'Fuera de servicio';
        fuelInStorage?: number;
    };
    satisfaction?: {
        percentage?: number;
        period?: string;
    };
}

export interface DataTableProps {
    title: string;
    columns: ColumnConfig[];
    data: DataProp[];
    addLabel: string | null;
    actions: boolean;
}
