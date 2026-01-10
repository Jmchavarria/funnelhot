'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

export default function TrainPage() {
  const params = useParams<{ id: string }>();
  const STORAGE_KEY_ASSISTANTS = 'assistants';
  const id = params?.id as string;

  const [assistant, setAssistant] = useState<any>(null);
  const [trainingData, setTrainingData] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Respuestas simuladas
  const simulatedResponses = [
    '¡Hola! ¿En qué puedo ayudarte hoy?',
    'Entiendo tu pregunta. Déjame ayudarte con eso.',
    'Esa es una excelente pregunta. Basándome en mi entrenamiento...',
    'Claro, puedo explicarte eso de manera más detallada.',
    '¿Hay algo más en lo que pueda asistirte?',
    'Perfecto, aquí está la información que solicitaste.',
    'Me alegra poder ayudarte con esto.',
    'Eso depende de varios factores, te explico...',
  ];

  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem(STORAGE_KEY_ASSISTANTS);
    if (stored) {
      try {
        const assistants = JSON.parse(stored);

        if (Array.isArray(assistants)) {
          const found = assistants.find((a) => a.id === id);
          setAssistant(found);
        } else if (typeof assistants === 'object') {
          setAssistant(assistants[id]);
        }
      } catch (error) {
        console.error('Error parsing localStorage:', error);
      }
    }

    const savedTraining = localStorage.getItem(`training_${id}`);
    if (savedTraining) setTrainingData(savedTraining);

    // (opcional) si quieres persistir el chat:
    const savedChat = localStorage.getItem(`chat_${id}`);
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch {}
    }
  }, [id]);

  const handleSave = () => {
    localStorage.setItem(`training_${id}`, trainingData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const persistChat = (next: ChatMsg[]) => {
    setMessages(next);
    // (opcional) persistencia
    localStorage.setItem(`chat_${id}`, JSON.stringify(next));
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMsg = { role: 'user', content: inputMessage };
    const updated = [...messages, userMessage];
    persistChat(updated);

    setInputMessage('');
    setIsTyping(true);

    const delay = Math.random() * 1000 + 1000; // 1-2s
    setTimeout(() => {
      const randomResponse =
        simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
      const assistantMessage: ChatMsg = { role: 'assistant', content: randomResponse };

      const final = [...updated, assistantMessage];
      persistChat(final);
      setIsTyping(false);
    }, delay);
  };

  const handleResetChat = () => {
    setIsTyping(false);
    persistChat([]);
    localStorage.removeItem(`chat_${id}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-10 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header del Asistente */}
      <div className="w-full max-w-5xl mt-24 sm:mt-28 border border-gray-200 rounded-2xl p-6 sm:p-10 bg-white shadow-lg mb-6 sm:mb-10">
        {assistant ? (
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-md">
              {assistant.name?.charAt(0) || 'A'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {assistant.name || 'Assistant'}
            </h1>
            <p className="text-gray-500 mt-2 font-mono text-xs sm:text-sm break-all">
              ID: {id}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-base sm:text-lg text-center">
            No se encontró el asistente
          </p>
        )}
      </div>

      {/* Contenedores principales: 1 col mobile / 2 col md+ */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
        {/* Columna Izquierda - Entrenamiento */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-lg p-5 sm:p-8 flex flex-col min-h-0 md:h-[620px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Entrenamiento</h2>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 leading-relaxed">
            Define el comportamiento y conocimiento de tu asistente. Los cambios se guardan localmente.
          </p>

          <textarea
            value={trainingData}
            onChange={(e) => setTrainingData(e.target.value)}
            placeholder={
              "Ejemplo:\n\nEres un asistente especializado en atención al cliente.\n\nCuando un usuario pregunte sobre productos, siempre menciona...\n\nTu tono debe ser amigable y profesional."
            }
            className="flex-1 min-h-[260px] md:min-h-0 w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all bg-gray-50"
          />

          <button
            onClick={handleSave}
            className="mt-4 sm:mt-5 w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all text-base sm:text-lg shadow-md hover:shadow-lg"
          >
            💾 GUARDAR ENTRENAMIENTO
          </button>

          {/* Toast responsive (verde) */}
          {showSuccess && (
            <div className="fixed z-50 top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto sm:w-[360px]">
              <div className="flex items-start gap-3 rounded-2xl bg-green-600 px-4 py-3 shadow-xl text-white border border-green-700">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-green-500 flex-shrink-0">
                  <span className="text-white text-lg font-bold">✓</span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug">Entrenamiento guardado</p>
                  <p className="text-xs text-green-100 break-words">
                    La información se guardó correctamente.
                  </p>

                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-green-500">
                    <div className="h-full w-full rounded-full bg-white opacity-80" />
                  </div>
                </div>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="ml-1 rounded-lg px-2 py-1 text-white hover:bg-green-500 flex-shrink-0"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha - Chat Simulado */}
        <div
          className="
            border border-gray-200 rounded-2xl bg-white shadow-lg
            p-5 sm:p-6 flex flex-col
            min-h-0
            h-[520px] sm:h-[550px] md:h-[620px]
          "
        >
          <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Chat Simulado</h2>
            </div>

            <button
              onClick={handleResetChat}
              className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-semibold transition-all"
            >
              🔄 Reiniciar
            </button>
          </div>

          <p className="text-[11px] sm:text-xs text-gray-500 mb-3 sm:mb-4">
            Respuestas simuladas con delay 1–2s (puedes cambiarlas por un JSON local).
          </p>

          {/* ✅ Área de mensajes con SCROLL SIEMPRE */}
          <div className="flex-1 min-h-0 bg-gray-50 rounded-xl p-3 sm:p-4 overflow-y-auto mb-3 sm:mb-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm">Envía un mensaje para comenzar</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-2xl text-sm break-words ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 sm:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all"
            >
              📤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
