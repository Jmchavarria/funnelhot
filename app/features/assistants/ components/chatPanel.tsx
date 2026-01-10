'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Bot, User, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type Props = {
  assistantName?: string;
  messages: Message[];
  isTyping: boolean;

  currentMessage: string;
  setCurrentMessage: (v: string) => void;

  onSend: () => void;
  onSimulate: () => void;
  onClear: () => void;
};

export function ChatPanel({
  assistantName,
  messages,
  isTyping,
  currentMessage,
  setCurrentMessage,
  onSend,
  onSimulate,
  onClear,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto scroll al final cuando cambian mensajes o typing
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isTyping]);

  const canSend = useMemo(() => currentMessage.trim().length > 0 && !isTyping, [currentMessage, isTyping]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[520px] h-[calc(100vh-220px)]">
      {/* Header fijo */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">Chat</p>
            <p className="text-xs text-gray-500 truncate max-w-[220px]">
              {assistantName ? assistantName : 'Asistente'}
            </p>
          </div>
        </div>

        <button onClick={onClear} className="text-xs text-red-600 hover:underline">
          Limpiar
        </button>
      </div>

      {/* Mensajes (scroll real) */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 bg-gray-50"
      >
        {messages.length === 0 && !isTyping && (
          <div className="h-full min-h-[200px] flex items-center justify-center text-sm text-gray-400">
            Escribe un mensaje para comenzar
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} m={m} />
        ))}

        {isTyping && <TypingBubble />}

        <div ref={endRef} />
      </div>

      {/* Input fijo abajo */}
      <div className="border-t bg-white p-3 sm:p-4">
        <div className="flex gap-2 items-end">
          <textarea
            rows={1}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Escribe un mensaje…"
            disabled={isTyping}
            className="flex-1 resize-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-60"
          />

          <button
            onClick={onSend}
            disabled={!canSend}
            className="h-10 px-4 rounded-lg bg-gray-900 text-white disabled:opacity-50 flex items-center justify-center"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onSimulate}
          disabled={isTyping}
          className="mt-2 w-full border border-gray-900 rounded-lg py-2 text-sm font-semibold disabled:opacity-50"
        >
          <Sparkles className="inline w-4 h-4 mr-1" />
          Simular respuesta
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ m }: { m: Message }) {
  const isUser = m.type === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end gap-2 max-w-[92%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
            isUser ? 'bg-gray-300' : 'bg-gray-900'
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-gray-700" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        <div
          className={`px-4 py-2 text-sm rounded-2xl shadow-sm border ${
            isUser
              ? 'bg-gray-900 text-white border-gray-900 rounded-br-md'
              : 'bg-white text-gray-900 border-gray-200 rounded-bl-md'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{m.content}</p>

          <div className={`text-[10px] mt-1 text-right ${isUser ? 'text-gray-300' : 'text-gray-400'}`}>
            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2 max-w-[92%] sm:max-w-[80%]">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>

      <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
}
