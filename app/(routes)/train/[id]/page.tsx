'use client';

import {
  Globe,
  Lightbulb,
  MessageSquareMore,
  Send,
  Sparkles,
  ArrowLeft,
  Copy,
  Trash2,
  CornerDownLeft,
  FilePlus2,
  X,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getAssistantTraining, saveAssistantTraining } from '@/app/features/training/storage/trainingStorage';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

export default function TrainPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const STORAGE_KEY_ASSISTANTS = 'assistants';
  const id = params?.id as string;

  const [assistant, setAssistant] = useState<any>(null);

  // ✅ trainingData is the current draft
  const [trainingData, setTrainingData] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ prompts list
  const [trainingPrompts, setTrainingPrompts] = useState<string[]>([]);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const promptsKey = `training_prompts_${id}`;
  const draftKey = `training_draft_${id}`; // optional: persist draft without saving as prompt


  const handleSavePrompt = () => {
    if (!trainingData.trim()) return;

    const next = [trainingData, ...trainingPrompts.filter(p => p !== trainingData)];

    setTrainingPrompts(next);
    saveAssistantTraining(id, next);

    setTrainingData('');
  };

  // Simulated responses
  const simulatedResponses = useMemo(
    () => [
      'Hi! How can I help you today?',
      "I understand your question. Let me help you with that.",
      "That's an excellent question. Based on my training...",
      'Sure, I can explain that in more detail.',
      'Is there anything else I can help you with?',
      "Perfect — here's the information you requested.",
      "I'm glad I can help with this.",
      'That depends on several factors — let me explain...',
    ],
    []
  );


  useEffect(() => {
    if (!id) return;

    const prompts = getAssistantTraining(id);
    setTrainingPrompts(prompts);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // assistants
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

    // ✅ load prompts list
    const savedPrompts = localStorage.getItem(promptsKey);
    if (savedPrompts) {
      try {
        const arr = JSON.parse(savedPrompts);
        if (Array.isArray(arr)) setTrainingPrompts(arr.filter(Boolean));
      } catch { }
    }

    // ✅ load draft (last thing you were typing)
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) setTrainingData(savedDraft);

    // chat
    const savedChat = localStorage.getItem(`chat_${id}`);
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch { }
    }
  }, [id, promptsKey, draftKey]);

  // ✅ persist draft as you type
  useEffect(() => {
    if (!id) return;
    localStorage.setItem(draftKey, trainingData);
  }, [trainingData, id, draftKey]);

  const persistPrompts = (next: string[]) => {
    setTrainingPrompts(next);
    localStorage.setItem(promptsKey, JSON.stringify(next));
  };

  const addPromptFromDraft = () => {
    const value = trainingData.trim();
    if (!value) return;

    // avoid exact duplicates; newest first
    const next = [value, ...trainingPrompts.filter((p) => p !== value)];
    persistPrompts(next);

    // feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);

    // clear draft
    setTrainingData('');
    localStorage.removeItem(draftKey);
  };

  const handleSave = () => {
    // "Save Training" now adds a prompt to the list
    addPromptFromDraft();
  };

  const handleUsePrompt = (prompt: string) => {
    setTrainingData(prompt);
  };

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1200);
    } catch { }
  };

  const handleDeletePrompt = (idx: number) => {
    const next = trainingPrompts.filter((_, i) => i !== idx);
    persistPrompts(next);
  };

  const persistChat = (next: ChatMsg[]) => {
    setMessages(next);
    localStorage.setItem(`chat_${id}`, JSON.stringify(next));
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMsg = { role: 'user', content: inputMessage };
    const updated = [...messages, userMessage];
    persistChat(updated);

    setInputMessage('');
    setIsTyping(true);

    const delay = Math.random() * 1000 + 1000;
    setTimeout(() => {
      const randomResponse =
        simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
      const assistantMessage: ChatMsg = { role: 'assistant', content: randomResponse };

      const final = [...updated, assistantMessage];
      persistChat(final);
      setIsTyping(false);
    }, delay);
  };

  // ✅ CONFIRM BEFORE RESET
  const handleResetChat = () => {
    if (isTyping) return;

    const ok = window.confirm(
      'Are you sure you want to reset the chat? This will delete the conversation for this assistant.'
    );
    if (!ok) return;

    setIsTyping(false);
    persistChat([]);
    localStorage.removeItem(`chat_${id}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-10 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Back */}
      <div className="w-full max-w-5xl mt-6 sm:mt-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="w-full max-w-2xl mt-6 sm:mt-8 border border-gray-200 rounded-xl p-5 sm:p-8 bg-white shadow-sm mb-6 sm:mb-8">
        {assistant ? (
          <div className="text-center space-y-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {assistant.name || 'Assistant'}
            </h1>

            <div className="flex flex-wrap justify-center gap-2">
              <span className="inline-flex gap-1.5 items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
                <Globe className="w-3.5 h-3.5" /> {assistant.language || '—'}
              </span>

              <span className="inline-flex gap-1.5 items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
                <Sparkles className="w-3.5 h-3.5" />{' '}
                {assistant.personality || assistant.tone || '—'}
              </span>
            </div>

            <p className="text-gray-500 font-mono text-xs break-all pt-1">
              ID: {id}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm sm:text-base text-center">
            Assistant not found
          </p>
        )}
      </div>

      {/* Layout */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
        {/* Training */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-lg p-5 sm:p-6 flex flex-col min-h-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Training
            </h2>
          </div>

          <p className="text-xs text-gray-500 mb-3 sm:mb-4 leading-relaxed">
            Save training prompts. They appear here and are stored locally.
          </p>

          {/* ✅ PROMPTS LIST */}
          {trainingPrompts.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                Saved prompts
              </p>

              <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-2 space-y-2">
                {trainingPrompts.map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white border border-gray-100 p-3 shadow-sm"
                  >
                    <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">
                      {p}
                    </p>

                    <div className="mt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleUsePrompt(p)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                      >
                        Use
                      </button>

                      <button
                        onClick={() => handleCopyPrompt(p)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition inline-flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </button>

                      <button
                        onClick={() => handleDeletePrompt(idx)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition inline-flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editor */}
          <textarea
            value={trainingData}
            onChange={(e) => setTrainingData(e.target.value)}
            onKeyDown={(e) => {
              // ✅ Ctrl+Enter / Cmd+Enter to save as prompt
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                addPromptFromDraft();
              }
            }}
            placeholder={
              "Write a training prompt and save it.\n\nTip: Ctrl + Enter to save.\n\nExample:\nYou are a customer support assistant..."
            }
            className="flex-1 min-h-64 md:min-h-0 w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all bg-gray-50"
          />

          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSave}
              disabled={!trainingData.trim()}
              className="w-full cursor-pointer flex gap-2 items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              <FilePlus2 className="w-5 h-5" />
              Save prompt
            </button>

            <button
              onClick={() => setTrainingData('')}
              disabled={!trainingData.trim()}
              className="w-full cursor-pointer flex gap-2 items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              <X className="w-5 h-5" />
              Clear
            </button>
          </div>

          <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-2">
            <CornerDownLeft className="w-3.5 h-3.5" />
            Tip: <span className="font-semibold">Ctrl + Enter</span> to save the prompt
          </p>

          {/* Toast */}
          {showSuccess && (
            <div className="fixed z-50 top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto sm:w-90">
              <div className="flex items-start gap-3 rounded-2xl bg-green-600 px-4 py-3 shadow-xl text-white border border-green-700">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-green-500 shrink-0">
                  <span className="text-white text-lg font-bold">✓</span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug">Saved</p>
                  <p className="text-xs text-green-100">
                    Prompt saved successfully.
                  </p>
                </div>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="ml-1 rounded-lg px-2 py-1 text-white hover:bg-green-500 shrink-0"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat */}
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
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Chat
              </h2>
            </div>

            <button
              onClick={handleResetChat}
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
                    className={`max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-2xl text-sm break-words ${msg.role === 'user'
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
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="cursor-pointer px-4 sm:px-6 py-3 bg-gray-700 hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all active:scale-[0.98]"
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
