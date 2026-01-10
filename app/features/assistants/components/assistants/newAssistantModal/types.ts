export type Step = 1 | 2;

export type AssistantForm = {
  name: string;
  language: string;
  tone: string;
  short: number;
  medium: number;
  long: number;
  audioEnabled: boolean;
};

export type NewAssistantModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: AssistantForm) => void;
  initialData?: any;
};