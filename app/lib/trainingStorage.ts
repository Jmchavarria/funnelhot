const STORAGE_KEY = 'training_data';

export function getTrainingData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getAssistantTraining(id: string) {
  const data = getTrainingData();
  return data[id]?.prompts ?? [];
}

export function saveAssistantTraining(id: string, prompts: string[]) {
  const data = getTrainingData();

  data[id] = {
    prompts,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
