// app/features/assistants/components/newAssistantModal/constants.ts

export const STORAGE_KEY_FORM = 'new-assistant-form';
export const STORAGE_KEY_STEP = 'new-assistant-step';

export const MIN_NAME = 3;
export const MAX_NAME = 40;

export const DEFAULT_FORM = {
  name: '',
  language: 'Spanish',
  tone: 'Professional',
  short: 30,
  medium: 40,
  long: 30,
  audioEnabled: false,
};
