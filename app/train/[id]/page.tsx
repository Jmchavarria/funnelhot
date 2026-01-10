'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TrainPage() {
    const params = useParams<{ id: string }>();
    const STORAGE_KEY_ASSISTANTS = 'assistants';
    const id = params?.id as string;

    const [assistant, setAssistant] = useState<any>(null);
    const [trainingData, setTrainingData] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Respuestas simuladas
    const simulatedResponses = [
        "¡Hola! ¿En qué puedo ayudarte hoy?",
        "Entiendo tu pregunta. Déjame ayudarte con eso.",
        "Esa es una excelente pregunta. Basándome en mi entrenamiento...",
        "Claro, puedo explicarte eso de manera más detallada.",
        "¿Hay algo más en lo que pueda asistirte?",
        "Perfecto, aquí está la información que solicitaste.",
        "Me alegra poder ayudarte con esto.",
        "Eso depende de varios factores, te explico...",
    ];

    useEffect(() => {
        if (!id) return;

        const stored = localStorage.getItem(STORAGE_KEY_ASSISTANTS);

        if (stored) {
            try {
                const assistants = JSON.parse(stored);

                if (Array.isArray(assistants)) {
                    const found = assistants.find(a => a.id === id);
                    setAssistant(found);
                }
                else if (typeof assistants === 'object') {
                    setAssistant(assistants[id]);
                }
            } catch (error) {
                console.error('Error parsing localStorage:', error);
            }
        }

        const savedTraining = localStorage.getItem(`training_${id}`);
        if (savedTraining) {
            setTrainingData(savedTraining);
        }
    }, [id]);

    const handleSave = () => {
        localStorage.setItem(`training_${id}`, trainingData);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        // Agregar mensaje del usuario
        const userMessage = { role: 'user' as const, content: inputMessage };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        // Simular "escribiendo..."
        setIsTyping(true);

        // Simular delay de respuesta (1-2 segundos)
        const delay = Math.random() * 1000 + 1000; // Entre 1 y 2 segundos
        setTimeout(() => {
            const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
            const assistantMessage = { role: 'assistant' as const, content: randomResponse };
            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, delay);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center px-8 bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header del Asistente */}
            <div style={{ marginTop: '120px' }} className="flex w-full max-w-5xl items-center justify-center border-2 border-gray-200 rounded-2xl p-10 bg-white shadow-lg mb-10">
                {assistant ? (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                            {assistant.name?.charAt(0) || 'A'}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">{assistant.name || 'Assistant'}</h1>
                        <p className="text-gray-500 mt-2 font-mono text-sm">ID: {id}</p>
                    </div>
                ) : (
                    <p className="text-gray-400 text-lg">No se encontró el asistente</p>
                )}
            </div>

            {/* Contenedores principales */}
            <div className="flex gap-8 w-full max-w-5xl mb-10">
                {/* Columna Izquierda - Entrenamiento */}
                <div className="flex-1 border-2 border-gray-200 rounded-2xl bg-white shadow-lg p-8 flex flex-col" style={{ height: '550px' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Entrenamiento
                        </h2>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        Define el comportamiento y conocimiento de tu asistente. Los cambios se guardan localmente.
                    </p>

                    <textarea
                        value={trainingData}
                        onChange={(e) => setTrainingData(e.target.value)}
                        placeholder="Ejemplo:&#10;&#10;Eres un asistente especializado en atención al cliente.&#10;&#10;Cuando un usuario pregunte sobre productos, siempre menciona...&#10;&#10;Tu tono debe ser amigable y profesional."
                        className="flex-1 w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all bg-gray-50 mb-5"
                    />

                    <button
                        onClick={handleSave}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        💾 GUARDAR ENTRENAMIENTO
                    </button>

                    {showSuccess && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 rounded-xl text-sm text-center font-semibold flex items-center justify-center gap-2 animate-pulse">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ¡Entrenamiento guardado exitosamente!
                        </div>
                    )}
                </div>

                {/* Columna Derecha - Chat Simulado */}
                <div className="flex-1 border-2 border-gray-200 rounded-2xl bg-white shadow-lg p-6 flex flex-col" style={{ height: '550px' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Chat Simulado</h2>
                        </div>
                        <button
                            onClick={() => setMessages([])}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-all"
                        >
                            🔄 Reiniciar
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                        Las respuestas son completamente simuladas, se pueden obtener de un JSON, deben tener delay para simular el fetch de la data...
                    </p>

                    {/* Área de mensajes */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 overflow-y-auto mb-4 space-y-3">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-sm">Envía un mensaje para comenzar</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                                        msg.role === 'user' 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-white border border-gray-200 text-gray-800'
                                    }`}>
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input de mensajes */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all"
                        >
                            📤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}