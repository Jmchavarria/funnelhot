'use client';

import { MessageSquareMore, Send } from 'lucide-react';
import type { ChatMsg } from '../hooks/useSimulatedChat';

type Props = {
  messages: ChatMsg[];
  inputMessage: string;
  setInputMessage: (v: string) => void;
  isTyping: boolean;
  sendMessage: () => void;
  resetChat: () => void;
};

export const ChatPanel = ({
  messages,
  inputMessage,
  setInputMessage,
  isTyping,
  sendMessage,
  resetChat,
}: Props) => {
  return (
    <div
      className="
        border border-gray-200 rounded-2xl bg-white shadow-lg
        p-5 sm:p-6 flex flex-col
        min-h-0
        h-[450px] sm:h-[480px] md:h-[500px]
      "
    >
      <div className="flex items-start sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <MessageSquareMore className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Chat</h2>
        </div>

        <button
          onClick={resetChat}
          className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-semibold transition-all"
        >
          🔄 Reset
        </button>
      </div>

      <p className="text-[11px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
        This is the first step to creating conversations that understand, respond, and evolve with you.
      </p>

      <div className="flex-1 min-h-0 bg-gray-50 rounded-xl p-3 sm:p-4 overflow-y-auto mb-2 sm:mb-3 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p className="text-sm">Send a message to start</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-2xl text-sm break-words ${
                  msg.role === 'user'
                    ? 'bg-black text-white'
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
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
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

      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="cursor-pointer px-4 sm:px-6 py-3 bg-gray-700 hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all active:scale-[0.98]"
          aria-label="Send"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
