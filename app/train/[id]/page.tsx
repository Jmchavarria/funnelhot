'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Save, Sparkles, Send, User, Trash2, Bot } from 'lucide-react';

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Respuestas simuladas predefinidas
const SIMULATED_RESPONSES = [
    "Entendido, ¿en qué más puedo ayudarte?",
    "Esa es una excelente pregunta. Déjame explicarte...",
    "Claro, con gusto te ayudo con eso.",
    "¿Podrías darme más detalles sobre tu consulta?",
    "Perfecto, he registrado esa información.",
    "Déjame verificar eso por ti.",
    "Basándome en tu consulta, te recomiendo...",
    "Es un placer poder asistirte con esto.",
    "¿Hay algo más en lo que pueda ayudarte?",
    "Entiendo tu punto. Permíteme explicarte mejor..."
];

export default function TrainPage() {
    const params = useParams();
    const [assistant, setAssistant] = useState<any>(null);
    const [trainingData, setTrainingData] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Cargar datos del asistente desde localStorage
        const stored = localStorage.getItem('assistants');
        if (stored) {
            const assistants = JSON.parse(stored);
            const foundAssistant = assistants.find((a: any) => a.id === params.id);
            setAssistant(foundAssistant);

            // Cargar datos de entrenamiento si existen
            const trainingKey = `training-${params.id}`;
            const savedTraining = localStorage.getItem(trainingKey);
            if (savedTraining) {
                setTrainingData(savedTraining);
            }

            // Cargar historial de chat si existe
            const chatKey = `chat-${params.id}`;
            const savedChat = localStorage.getItem(chatKey);
            if (savedChat) {
                setMessages(JSON.parse(savedChat));
            }
        }
    }, [params.id]);

    
    const handleSaveTraining = () => {
        setIsSaving(true);

        setTimeout(() => {
            const trainingKey = `training-${params.id}`;
            localStorage.setItem(trainingKey, trainingData);
            setIsSaving(false);
            alert('Datos de entrenamiento guardados correctamente');
        }, 500);
    };

    const handleSendMessage = async () => {
        if (!currentMessage.trim() || isTyping) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: currentMessage,
            timestamp: new Date()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setCurrentMessage('');
        setIsTyping(true);

        const delay = Math.floor(Math.random() * 1000) + 1000;

        setTimeout(() => {
            const randomResponse = SIMULATED_RESPONSES[
                Math.floor(Math.random() * SIMULATED_RESPONSES.length)
            ];

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: randomResponse,
                timestamp: new Date()
            };

            const finalMessages = [...updatedMessages, assistantMessage];
            setMessages(finalMessages);
            setIsTyping(false);

            const chatKey = `chat-${params.id}`;
            localStorage.setItem(chatKey, JSON.stringify(finalMessages));
        }, delay);
    };

    const handleSimulateResponse = () => {
        if (isTyping) return;

        setIsTyping(true);
        const delay = Math.floor(Math.random() * 1000) + 1000;

        setTimeout(() => {
            const randomResponse = SIMULATED_RESPONSES[
                Math.floor(Math.random() * SIMULATED_RESPONSES.length)
            ];

            const assistantMessage: Message = {
                id: Date.now().toString(),
                type: 'assistant',
                content: randomResponse,
                timestamp: new Date()
            };

            const finalMessages = [...messages, assistantMessage];
            setMessages(finalMessages);
            setIsTyping(false);

            const chatKey = `chat-${params.id}`;
            localStorage.setItem(chatKey, JSON.stringify(finalMessages));
        }, delay);
    };

    const handleClearChat = () => {
        if (confirm('¿Estás seguro de que deseas borrar todo el historial del chat?')) {
            setMessages([]);
            const chatKey = `chat-${params.id}`;
            localStorage.removeItem(chatKey);
        }
    };


    if (!assistant) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando asistente...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto w-full max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="inline-block px-5 py-3 bg-white rounded-lg border border-gray-300 shadow-sm mb-4">
                        <p className="text-sm text-gray-700">
                            RUTA: <span className="font-bold">/{params.id}</span> DEL ASISTENTE
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Datos del Asistente</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-sm">Nombre:</span>
                                <span className="font-semibold text-gray-900">{assistant.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-sm">Idioma:</span>
                                <span className="font-semibold text-gray-900">{assistant.language}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-sm">Tono:</span>
                                <span className="font-semibold text-gray-900">{assistant.tone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-sm">ID:</span>
                                <span className="font-mono text-sm font-semibold text-gray-900">{assistant.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenedor principal */}
                <div className="flex gap-6">
                    {/* Columna izquierda - Entrenamiento (2/3) */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
                            <h3 className="text-lg font-bold mb-2 text-gray-900">Entrenamiento del asistente</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Los datos se guardan localmente y persistirán al refrescar la página
                            </p>

                            <textarea
                                value={trainingData}
                                onChange={(e) => setTrainingData(e.target.value)}
                                placeholder="Escribe aquí las instrucciones de entrenamiento para tu asistente..."
                                className="w-full h-[500px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
                            />

                            <div className="flex justify-start mt-4">
                                <button
                                    onClick={handleSaveTraining}
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] shadow-sm"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            GUARDAR
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Chat Simulado (1/3) */}
                    <div className='border flex flex-1'>
                        <div className="flex flex-col w-full h-full bg-white">
                            {/* HEADER */}
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                                <span className="font-semibold text-sm">Chat</span>
                                <button
                                    onClick={handleClearChat}
                                    className="text-xs text-red-600 hover:underline"
                                >
                                    Limpiar
                                </button>
                            </div>

                            {/* MENSAJES (SCROLL REAL) */}
                            <div
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
                            >
                                {messages.length === 0 && !isTyping && (
                                    <div className="h-full flex items-center justify-center text-sm text-gray-400">
                                        Escribe un mensaje para comenzar
                                    </div>
                                )}

                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        {m.type === 'assistant' && (
                                            <div className="mr-2 flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[70%] px-4 py-2 text-sm rounded-2xl ${m.type === 'user'
                                                ? 'bg-gray-900 text-white rounded-br-md'
                                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                                }`}
                                        >
                                            {m.content}
                                            <div className="text-[10px] text-gray-400 mt-1 text-right">
                                                {new Date(m.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>

                                        {m.type === 'user' && (
                                            <div className="ml-2 flex-shrink-0 w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                                                <User className="w-4 h-4 text-gray-700" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* TYPING */}
                                {isTyping && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* INPUT FIJO */}
                            <div className="border-t px-3 py-3 space-y-2">
                                <div className="flex gap-2">
                                    <textarea
                                        rows={1}
                                        value={currentMessage}
                                        onChange={(e) => setCurrentMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder="Escribe un mensaje…"
                                        disabled={isTyping}
                                        className="flex-1 resize-none px-3 py-2 border rounded-lg text-sm focus:outline-none"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!currentMessage.trim() || isTyping}
                                        className="bg-gray-900 text-white px-4 rounded-lg disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleSimulateResponse}
                                    disabled={isTyping}
                                    className="w-full border border-gray-900 rounded-lg py-2 text-sm font-semibold"
                                >
                                    <Sparkles className="inline w-4 h-4 mr-1" />
                                    Simular respuesta
                                </button>
                            </div>
                        </div>




                    </div>
                </div>
            </div>
        </div>
    );
}