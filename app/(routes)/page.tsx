'use client';

import { useEffect, useState, useMemo } from 'react';
import { DataTable } from '../features/assistants/components/dataTable';
import { DataProp } from '../types';

/**
 * Estructura de los datos de entrenamiento
 * guardados en localStorage.
 *
 * key = assistant.id
 */
type TrainingStore = Record<
  string,
  {
    prompts?: string[];
    draft?: string;
  }
>;

export default function Home() {
  /**
   * Estado principal con los asistentes
   * ya enriquecidos con información extra
   */
  const [assistants, setAssistants] = useState<DataProp[]>([]);

  /**
   * Carga inicial:
   * - Lee asistentes desde localStorage
   * - Lee datos de entrenamiento
   * - Une ambos para enriquecer cada assistant
   */
  useEffect(() => {
    try {
      const rawAssistants = localStorage.getItem('assistants');
      const rawTraining = localStorage.getItem('training_data');

      // Si no hay asistentes guardados, no hacemos nada
      if (!rawAssistants) return;

      const assistantsParsed = JSON.parse(rawAssistants) as DataProp[];
      const trainingData: TrainingStore = rawTraining
        ? JSON.parse(rawTraining)
        : {};

      /**
       * Enriquecemos cada assistant:
       * - Garantizamos que `name` exista
       * - Calculamos si tiene entrenamiento
       * - Contamos prompts de entrenamiento
       */
      const enriched: DataProp[] = assistantsParsed.map((a) => {
        const prompts = trainingData[a.id]?.prompts ?? [];

        return {
          ...a,

          // DataProp exige name → fallback seguro
          name: a.name ?? 'Untitled Assistant',

          // Campos derivados (útiles para UI)
          hasTraining: prompts.length > 0,
          trainingCount: prompts.length,
        } as DataProp;
      });

      setAssistants(enriched);
    } catch (e) {
      // Protección contra JSON corrupto
      console.error('Error parsing localStorage', e);
    }
  }, []);

  /**
   * Definición de columnas para DataTable
   * useMemo evita recrearlas en cada render
   */
  const columns = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'id', label: 'ID' },
      { key: 'language', label: 'Language' },
      { key: 'personality', label: 'Tone/Personality' },
    ],
    [],
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-0 sm:px-6">
      <div className="w-full p-8">
        <DataTable
          data={assistants}     // lista final ya procesada
          columns={columns}     // definición de columnas
          title="AI ASSISTANTS"  // título del módulo
          addLabel="Create"     // texto del botón crear
          actions               // habilita acciones (edit, delete, train)
        />
      </div>
    </div>
  );
}
