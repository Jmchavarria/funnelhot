// app/features/assistants/components/newAssistantModal/NewAssistantModal.tsx
'use client';

import React from 'react';
import { X } from 'lucide-react';

import type { NewAssistantModalProps } from './types';
import { useAssistantForm } from './hooks/useAssistantForm';
import { StepOne } from './components/stepOne';
import { StepTwo } from './components/stepTwo';
import { StepIndicator } from './components/stepIndicator';

/**
 * Modal para crear o editar un Assistant.
 * Maneja un flujo en 2 pasos:
 *  1. Información básica
 *  2. Configuración de respuestas
 */
export const NewAssistantModal: React.FC<NewAssistantModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  // Si hay initialData, estamos editando
  const isEditMode = !!initialData;

  /**
   * Hook central del formulario:
   * - Estado del step
   * - Validaciones
   * - Handlers de navegación y submit
   * - Límites y reglas del nombre
   */
  const {
    step,
    setStep,
    form,
    setForm,

    nameError,
    nameLength,
    showNameError,
    setNameTouched,

    totalResponses,
    isStep1Valid,
    isStep2Valid,

    handleNameChange,
    handleNext,
    handleSubmit,
    handleClose,

    MAX_NAME,
    MIN_NAME,
  } = useAssistantForm({
    open,
    isEditMode,
    initialData,
    onSubmit,
    onClose,
  });

  // No renderizar nada si el modal está cerrado
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 
        Overlay oscuro con blur.
        Cerrar modal al hacer click fuera.
      */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Contenedor del modal */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 z-10 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between">
            {/* 
              Título dinámico:
              - Cambia según modo (crear / editar)
              - Cambia según step
            */}
            <h3 className="text-xl font-bold text-gray-900">
              {isEditMode
                ? step === 1
                  ? 'Edit Assistant'
                  : 'Edit Response Configuration'
                : step === 1
                ? 'New Assistant'
                : 'Response Configuration'}
            </h3>

            {/* 
              Icono cerrar:
              - En step 1 → cierra modal
              - En step 2 → vuelve al step 1
            */}
            <X
              className="cursor-pointer hover:text-gray-700 hover:scale-110 transition-all"
              onClick={step === 1 ? handleClose : () => setStep(1)}
            />
          </div>

          {/* Indicador de progreso textual */}
          <p className="text-sm text-gray-500">Step {step} of 2</p>
        </div>

        {/* Indicador visual de pasos */}
        <StepIndicator step={step} />

        {/* Contenido principal según step */}
        {step === 1 ? (
          <StepOne
            form={form}
            setForm={setForm}
            nameLength={nameLength}
            showNameError={showNameError}
            nameError={nameError}
            MAX_NAME={MAX_NAME}
            MIN_NAME={MIN_NAME}
            onNameChange={handleNameChange}
            onNameBlur={() => setNameTouched(true)}
          />
        ) : (
          <StepTwo
            form={form}
            setForm={setForm}
            totalResponses={totalResponses}
            isStep2Valid={isStep2Valid}
          />
        )}

        {/* Footer con acciones */}
        <div className="flex justify-between gap-3 pt-8">
          {/* Botón cancelar / volver */}
          <button
            onClick={step === 1 ? handleClose : () => setStep(1)}
            className="px-4 cursor-pointer py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {/* CTA principal dependiente del step */}
          {step === 1 ? (
            <button
              disabled={!isStep1Valid}
              onClick={handleNext}
              className="px-4 cursor-pointer py-2 rounded-lg bg-gray-900 text-white disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <button
              disabled={!isStep2Valid}
              onClick={handleSubmit}
              className="cursor-pointer px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-40"
            >
              {isEditMode ? 'Save changes' : 'Create assistant'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
