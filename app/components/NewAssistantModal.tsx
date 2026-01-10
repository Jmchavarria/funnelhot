'use client';

import { X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface NewAssistantModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialData?: any;
}

type Step = 1 | 2;

const STORAGE_KEY_FORM = 'new-assistant-form';
const STORAGE_KEY_STEP = 'new-assistant-step';

const DEFAULT_FORM = {
  name: '',
  language: 'Spanish',
  tone: 'Professional',
  short: 30,
  medium: 40,
  long: 30,
  audioEnabled: false,
};

export const NewAssistantModal: React.FC<NewAssistantModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const isEditMode = !!initialData;

  // -----------------------------
  // STATE
  // -----------------------------
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState(() => DEFAULT_FORM);

  // -----------------------------
  // SCROLL LOCK (BODY)
  // -----------------------------
  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight =
      scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';

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

    // Create mode: recuperar de localStorage
    const storedStep = localStorage.getItem(STORAGE_KEY_STEP);
    if (storedStep === '1' || storedStep === '2') {
      setStep(Number(storedStep) as Step);
    } else {
      setStep(1);
    }

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
  const totalResponses = useMemo(
    () => form.short + form.medium + form.long,
    [form.short, form.medium, form.long]
  );

  const isStep1Valid =
    form.name.trim().length > 0 &&
    form.language.length > 0 &&
    form.tone.length > 0;

  const isStep2Valid = totalResponses === 100;

  // -----------------------------
  // HANDLERS
  // -----------------------------
  const handleSubmit = () => {
    if (!isStep2Valid) return;

    onSubmit?.(form);

    if (!isEditMode) {
      localStorage.removeItem(STORAGE_KEY_FORM);
      localStorage.removeItem(STORAGE_KEY_STEP);
    }

    setForm(DEFAULT_FORM);
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    if (isEditMode) {
      setForm(DEFAULT_FORM);
      setStep(1);
    } else {
      // si NO quieres persistir cuando cancelas:
      localStorage.removeItem(STORAGE_KEY_FORM);
      localStorage.removeItem(STORAGE_KEY_STEP);
      setForm(DEFAULT_FORM);
      setStep(1);
    }

    onClose();
  };


  // ✅ UN SOLO RETURN CONDICIONAL, AL FINAL DE LOS HOOKS
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal (scrolleable) */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 z-10 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {isEditMode
                ? step === 1
                  ? 'Edit Assistant'
                  : 'Edit Response Configuration'
                : step === 1
                  ? 'New Assistant'
                  : 'Response Configuration'}
            </h3>

            <X
              className="cursor-pointer hover:text-gray-700 hover:scale-110 transition-all"
              onClick={step === 1 ? handleClose : () => setStep(1)}
            />
          </div>

          <p className="text-sm text-gray-500">Step {step} of 2</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step === 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
              }`}
          >
            1
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-3" />
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step === 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
              }`}
          >
            2
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assistant name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="e.g. Sales Assistant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option>Spanish</option>
                <option>English</option>
                <option>Portuguese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tone
              </label>
              <select
                value={form.tone}
                onChange={(e) => setForm({ ...form, tone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option>Formal</option>
                <option>Casual</option>
                <option>Professional</option>
                <option>friendly</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Response length distribution (must total 100%)
              </p>

              {(['short', 'medium', 'long'] as const).map((key) => (
                <div key={key} className="flex items-center gap-3 mb-3">
                  <span className="w-20 text-sm capitalize">{key}</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: Number(e.target.value) })
                    }
                    className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              ))}

              <p
                className={`text-sm ${isStep2Valid ? 'text-green-600' : 'text-red-500'
                  }`}
              >
                Total: {totalResponses}%
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Enable audio responses</span>
              <input
                type="checkbox"
                checked={form.audioEnabled}
                onChange={(e) =>
                  setForm({ ...form, audioEnabled: e.target.checked })
                }
                className="h-4 w-4"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between gap-3 pt-8">
          <button
            onClick={step === 1 ? handleClose : () => setStep(1)}
            className="px-4 cursor-pointer py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step === 1 ? (
            <button
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
              className="px-4 cursor-pointer py-2 rounded-lg bg-gray-900 text-white disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <button
              disabled={!isStep2Valid}
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-40"
            >
              {isEditMode ? 'Save changes' : 'Create assistant'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
