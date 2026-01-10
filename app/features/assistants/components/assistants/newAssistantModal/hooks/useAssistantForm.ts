'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_FORM, MAX_NAME, MIN_NAME, STORAGE_KEY_FORM, STORAGE_KEY_STEP } from '../constant';
import type { AssistantForm, Step } from '../types';

type Params = {
  open: boolean;
  isEditMode: boolean;
  initialData?: any;
  onSubmit?: (data: AssistantForm) => void;
  onClose: () => void;
};

export function useAssistantForm({
  open,
  isEditMode,
  initialData,
  onSubmit,
  onClose,
}: Params) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<AssistantForm>(DEFAULT_FORM);
  const [nameTouched, setNameTouched] = useState(false);

  // -----------------------------
  // SCROLL LOCK (BODY)
  // -----------------------------
  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // -----------------------------
  // LOAD STEP + FORM WHEN OPEN
  // -----------------------------
  useEffect(() => {
    if (!open) return;

    setNameTouched(false);

    if (isEditMode) {
      setStep(1);
      setForm({
        name: initialData?.name || '',
        language: initialData?.language || 'Spanish',
        tone: initialData?.tone || initialData?.personality || 'Professional',
        short: initialData?.short || 30,
        medium: initialData?.medium || 40,
        long: initialData?.long || 30,
        audioEnabled: initialData?.audioEnabled || false,
      });
      return;
    }

    const storedStep = localStorage.getItem(STORAGE_KEY_STEP);
    if (storedStep === '1' || storedStep === '2') setStep(Number(storedStep) as Step);
    else setStep(1);

    const storedForm = localStorage.getItem(STORAGE_KEY_FORM);
    if (storedForm) {
      try {
        setForm(JSON.parse(storedForm));
      } catch {
        setForm(DEFAULT_FORM);
      }
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [open, isEditMode, initialData]);

  // -----------------------------
  // PERSIST (ONLY WHEN OPEN + CREATE MODE)
  // -----------------------------
  useEffect(() => {
    if (!open) return;
    if (isEditMode) return;
    localStorage.setItem(STORAGE_KEY_STEP, step.toString());
  }, [open, step, isEditMode]);

  useEffect(() => {
    if (!open) return;
    if (isEditMode) return;
    localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(form));
  }, [open, form, isEditMode]);

  // -----------------------------
  // VALIDATIONS
  // -----------------------------
  const totalResponses = useMemo(() => form.short + form.medium + form.long, [form.short, form.medium, form.long]);

  const nameTrimmed = form.name.trim();
  const nameLength = nameTrimmed.length;

  const nameError = useMemo(() => {
    if (!nameTrimmed) return 'Assistant name is required.';
    if (nameLength < MIN_NAME) return `Name must be at least ${MIN_NAME} characters.`;
    if (nameLength > MAX_NAME) return `Name must be at most ${MAX_NAME} characters.`;
    return '';
  }, [nameTrimmed, nameLength]);

  const isStep1Valid = !nameError && form.language.length > 0 && form.tone.length > 0;
  const isStep2Valid = totalResponses === 100;

  const showNameError = nameTouched && !!nameError;

  // -----------------------------
  // HANDLERS
  // -----------------------------
  const handleNameChange = (value: string) => {
    const cleaned = value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
    setForm((p) => ({ ...p, name: cleaned }));
    if (!nameTouched) setNameTouched(true);
  };

  const handleNext = () => {
    setNameTouched(true);
    if (!isStep1Valid) return;
    setStep(2);
  };

  const resetLocalDraft = () => {
    localStorage.removeItem(STORAGE_KEY_FORM);
    localStorage.removeItem(STORAGE_KEY_STEP);
  };

  const resetState = () => {
    setForm(DEFAULT_FORM);
    setStep(1);
    setNameTouched(false);
  };

  const handleSubmit = () => {
    if (!isStep2Valid) return;
    onSubmit?.(form);

    if (!isEditMode) resetLocalDraft();
    resetState();
    onClose();
  };

  const handleClose = () => {
    if (!isEditMode) resetLocalDraft();
    resetState();
    onClose();
  };

  return {
    step,
    setStep,
    form,
    setForm,

    // name validation
    nameTouched,
    setNameTouched,
    nameError,
    nameLength,
    showNameError,

    // validations
    totalResponses,
    isStep1Valid,
    isStep2Valid,

    // handlers
    handleNameChange,
    handleNext,
    handleSubmit,
    handleClose,

    // const
    MAX_NAME,
    MIN_NAME,
    isEditMode,
  };
}
