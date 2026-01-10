'use client';

import { useParams } from 'next/navigation';
import { AssistantHeader } from '@/app/features/training/components/AssistantHeader';
import { TrainingPanel } from '@/app/features/training/components/TrainingPanel';
import { ChatPanel } from '@/app/features/training/components/ChatPanel';
import { useTraining } from '@/app/features/training/hooks/useTraining';
import { useSimulatedChat } from '@/app/features/training/hooks/useSimulatedChat';
import { useTrainingAssistant } from '@/app/features/training/hooks/useTrainingAssistant';

export default function TrainPage() {
  const params = useParams<{ id: string }>();
  const id = (params?.id ?? '') as string;

  const { assistant } = useTrainingAssistant(id);
  const training = useTraining(id);
  const chat = useSimulatedChat(id);

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-10 bg-linear-to-br from-gray-50 to-gray-100">
      <AssistantHeader id={id} assistant={assistant} />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
        <TrainingPanel
          trainingData={training.trainingData}
          setTrainingData={training.setTrainingData}
          trainingPrompts={training.trainingPrompts}
          addPromptFromDraft={training.addPromptFromDraft}
          usePrompt={training.usePrompt}
          copyPrompt={training.copyPrompt}
          deletePrompt={training.deletePrompt}
          clearDraft={training.clearDraft}
          showSuccess={training.showSuccess}
          setShowSuccess={training.setShowSuccess}
        />

        <ChatPanel
          messages={chat.messages}
          inputMessage={chat.inputMessage}
          setInputMessage={chat.setInputMessage}
          isTyping={chat.isTyping}
          sendMessage={chat.sendMessage}
          resetChat={chat.resetChat}
        />
      </div>
    </div>
  );
}
