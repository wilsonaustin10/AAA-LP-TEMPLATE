'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { FormState, FormStep, FormErrors, SubmissionResponse } from '../types';
import { setupPartialLeadCapture } from '../utils/formUtils';
import { validatePhone, validateEmail } from '../utils/validation';

interface FormContextType {
  formState: FormState;
  updateFormData: (data: Partial<FormState>) => void;
  currentStep: FormStep;
  setCurrentStep: (step: FormStep) => void;
  isStepCompleted: (step: FormStep) => boolean;
  clearFormData: () => void;
  submitForm: () => Promise<SubmissionResponse>;
  errors: FormErrors;
  setFieldError: (field: string, error: string | undefined) => void;
  clearFieldError: (field: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const initialState: FormState = {
  address: '',
  phone: '',
  consent: false,
  firstName: '',
  lastName: '',
  email: '',
  propertyCondition: '',
  timeframe: '',
  price: '',
  isSubmitting: false,
  error: '',
  leadId: '',
};

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formState, setFormState] = useState<FormState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('leadFormData');
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
    }
    return initialState;
  });

  const [currentStep, setCurrentStep] = useState<FormStep>('initial');
  const [errors, setErrors] = useState<FormErrors>({});

  // Track form load time for analytics
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.pageLoadTime = Date.now();
    }
  }, []);

  // Persist form data to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !formState.isSubmitting) {
      localStorage.setItem('leadFormData', JSON.stringify(formState));
    }
  }, [formState]);

  // Setup partial lead capture only after initial submission
  useEffect(() => {
    if (currentStep !== 'initial' && formState.address && formState.phone) {
      const cleanup = setupPartialLeadCapture(formState);
      return cleanup;
    }
  }, [currentStep, formState]);

  // Memoized validation functions
  const validateField = useCallback((field: keyof FormState, value: any): string | undefined => {
    switch (field) {
      case 'phone':
        return value && !validatePhone(value) ? 'Please enter a valid phone number' : undefined;
      case 'email':
        return value && !validateEmail(value) ? 'Please enter a valid email address' : undefined;
      case 'address':
        return !value?.trim() ? 'Property address is required' : undefined;
      case 'consent':
        return !value ? 'You must consent to be contacted' : undefined;
      default:
        return undefined;
    }
  }, []);

  // Optimized form state updates with validation
  const updateFormData = useCallback((newData: Partial<FormState>) => {
    setFormState(prev => {
      const updated = { ...prev, ...newData };
      
      // Validate only changed fields
      const newErrors: FormErrors = {};
      Object.keys(newData).forEach((key) => {
        const error = validateField(key as keyof FormState, updated[key as keyof FormState]);
        if (error) {
          newErrors[key] = error;
        }
      });
      
      // Update errors for changed fields
      if (Object.keys(newErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...newErrors }));
      } else {
        // Clear errors for successfully validated fields
        setErrors(prev => {
          const cleared = { ...prev };
          Object.keys(newData).forEach(key => {
            delete cleared[key];
          });
          return cleared;
        });
      }
      
      return updated;
    });
  }, [validateField]);

  // Field-specific error management
  const setFieldError = useCallback((field: string, error: string | undefined) => {
    setErrors(prev => {
      if (error) {
        return { ...prev, [field]: error };
      }
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Enhanced form validation with detailed error messages
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    const requiredFields: Array<keyof FormState> = ['address', 'phone', 'consent'];
    requiredFields.forEach(field => {
      const error = validateField(field, formState[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Additional field validations based on current step
    if (currentStep === 'property-details' && !formState.propertyCondition) {
      newErrors.propertyCondition = 'Please select property condition';
    }
    if (currentStep === 'timeline' && !formState.timeframe) {
      newErrors.timeframe = 'Please select your preferred timeframe';
    }
    if (currentStep === 'contact') {
      if (!formState.firstName) newErrors.firstName = 'First name is required';
      if (!formState.lastName) newErrors.lastName = 'Last name is required';
      if (!formState.email) newErrors.email = 'Email is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState, currentStep, validateField]);

  const clearFormData = useCallback(() => {
    setFormState(initialState);
    setErrors({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('leadFormData');
    }
  }, []);

  // Handle initial partial submission
  const submitPartialLead = useCallback(async (): Promise<SubmissionResponse> => {
    if (!formState.address || !formState.phone || !formState.consent) {
      return { success: false, error: 'Address, phone, and consent are required' };
    }

    try {
      const response = await fetch('/api/submit-partial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: formState.address,
          phone: formState.phone,
          consent: formState.consent
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit partial lead');
      }

      updateFormData({ leadId: result.leadId });
      return { success: true, leadId: result.leadId };
    } catch (error) {
      console.error('Error submitting partial lead:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, [formState.address, formState.phone, formState.consent, updateFormData]);

  // Memoized step completion handler
  const isStepCompleted = useCallback((step: FormStep): boolean => {
    switch (step) {
      case 'initial':
        // Submit partial lead when first step is completed
        if (formState.address && formState.phone && !formState.leadId) {
          submitPartialLead();
        }
        return Boolean(formState.address && formState.phone);
      case 'property-details':
        return Boolean(formState.propertyCondition);
      case 'timeline':
        return Boolean(formState.timeframe);
      case 'contact':
        return Boolean(formState.firstName && formState.lastName && formState.email);
      case 'thank-you':
        return true;
      default:
        return false;
    }
  }, [formState, submitPartialLead]);

  // Modified form submission to include leadId
  const submitForm = useCallback(async (): Promise<SubmissionResponse> => {
    if (!validateForm()) {
      return { success: false, error: 'Please correct the errors before submitting' };
    }

    updateFormData({ isSubmitting: true, error: '' });

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          lastUpdated: new Date().toISOString()
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      if (result.success) {
        clearFormData();
        // Track successful submission
        if (typeof window !== 'undefined') {
          window.gtag?.('event', 'form_submission_success', {
            event_category: 'Lead',
            event_label: 'Complete'
          });
          window.fbq?.('track', 'Lead');
          window.hj?.('trigger', 'form_submission_success');
        }
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      updateFormData({ error: errorMessage, isSubmitting: false });
      return { success: false, error: errorMessage };
    }
  }, [formState, validateForm, updateFormData, clearFormData]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    formState,
    updateFormData,
    currentStep,
    setCurrentStep,
    isStepCompleted,
    clearFormData,
    submitForm,
    errors,
    setFieldError,
    clearFieldError,
  }), [
    formState,
    updateFormData,
    currentStep,
    isStepCompleted,
    clearFormData,
    submitForm,
    errors,
    setFieldError,
    clearFieldError,
  ]);

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}