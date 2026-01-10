'use client'
import { useEffect, useState, useMemo } from "react";
import { DataTable } from "./components/dataTable";

export default function Home() {
  const [assistants, setAssistants] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('assistants');
    if (raw) {
      try {
        setAssistants(JSON.parse(raw));
      } catch (e) {
        console.error('Error parseando localStorage', e);
      }
    }
  }, []);

  const columns = useMemo(() => [
    { key: 'id', label: 'ID' },
    { key: 'language', label: 'Language' },
    { key: 'personality', label: 'Tone/Personality' },
  ], []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-0 sm:px-6">

      <div className="w-full p-8 ">
        <DataTable
          data={assistants}
          addLabel={'Create'}
          columns={columns}
          title="ASISTENTES IA"
          actions={true}
        />
      </div>
    </div>
  );
}
