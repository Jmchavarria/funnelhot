'use client';

import { useEffect, useState, useMemo } from 'react';
import { DataTable } from '../features/assistants/components/dataTable';
import { DataProp } from '../types';

type TrainingStore = Record<
  string,
  {
    prompts?: string[];
    draft?: string;
  }
>;

export default function Home() {
  const [assistants, setAssistants] = useState<DataProp[]>([]);

  useEffect(() => {
    try {
      const rawAssistants = localStorage.getItem('assistants');
      const rawTraining = localStorage.getItem('training_data');

      if (!rawAssistants) return;

      const assistantsParsed = JSON.parse(rawAssistants) as DataProp[];
      const trainingData: TrainingStore = rawTraining ? JSON.parse(rawTraining) : {};

      const enriched: DataProp[] = assistantsParsed.map((a) => {
        const prompts = trainingData[a.id]?.prompts ?? [];

        return {
          ...a,
          // ✅ asegúrate que "name" exista siempre (DataProp lo exige)
          name: a.name ?? 'Untitled Assistant',

          // ✅ campos extra (si DataProp permite extras, normalmente sí)
          hasTraining: prompts.length > 0,
          trainingCount: prompts.length,
        } as DataProp;
      });

      setAssistants(enriched);
    } catch (e) {
      console.error('Error parsing localStorage', e);
    }
  }, []);

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Name' }, // ✅ si DataProp tiene name, también muéstralo
      { key: 'id', label: 'ID' },
      { key: 'language', label: 'Language' },
      { key: 'personality', label: 'Tone/Personality' },
      // { key: 'trainingCount', label: 'Training' }, // solo si tu DataTable soporta esa columna
    ],
    []
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-0 sm:px-6">
      <div className="w-full p-8">
        <DataTable
          data={assistants}
          addLabel="Create"
          columns={columns}
          title="AI ASSISTANTS"
          actions
        />
      </div>
    </div>
  );
}
