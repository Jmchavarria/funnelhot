'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { readLS, removeLS, writeLS } from '../utils/storage';

export type ChatMsg = { role: 'user' | 'assistant'; content: string };

export const useSimulatedChat = (id: string) => {
  const chatKey = useMemo(() => `chat_${id}`, [id]);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef<number | null>(null);

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

  const persistChat = useCallback(
    (next: ChatMsg[]) => {
      setMessages(next);
      writeLS(chatKey, next);
    },
    [chatKey]
  );

  // Load chat
  useEffect(() => {
    if (!id) return;
    setMessages(readLS<ChatMsg[]>(chatKey, []));
  }, [id, chatKey]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const sendMessage = useCallback(() => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMsg = { role: 'user', content: inputMessage.trim() };
    const updated = [...messages, userMessage];
    persistChat(updated);

    setInputMessage('');
    setIsTyping(true);

    const delay = Math.random() * 1000 + 900;

    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = window.setTimeout(() => {
      const randomResponse =
        simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];

      const assistantMessage: ChatMsg = { role: 'assistant', content: randomResponse };
      persistChat([...updated, assistantMessage]);

      setIsTyping(false);
    }, delay);
  }, [inputMessage, isTyping, messages, persistChat, simulatedResponses]);

  const resetChat = useCallback(() => {
    if (isTyping) return;

    const ok = window.confirm(
      'Are you sure you want to reset the chat? This will delete the conversation for this assistant.'
    );
    if (!ok) return;

    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = null;

    setIsTyping(false);
    persistChat([]);
    removeLS(chatKey);
  }, [isTyping, persistChat, chatKey]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    sendMessage,
    resetChat,
  };
};
