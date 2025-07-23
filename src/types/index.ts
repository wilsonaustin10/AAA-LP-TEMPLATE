// Form Types
export interface LeadFormData {
  // Address fields (required)
  address: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  placeId?: string;

  // Contact information (required)
  phone: string;
  consent: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;

  // Property details
  isPropertyListed?: boolean;
  propertyCondition?: string;
  timeframe?: string;
  price?: string;
  comments?: string;
  referralSource?: string;

  // System tracking
  timestamp?: string;
  lastUpdated?: string;
  leadId?: string;
  submissionType?: 'partial' | 'complete';
}

export interface FormState extends LeadFormData {
  isSubmitting?: boolean;
  error?: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
  address?: string;
  phone?: string;
  consent?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  propertyCondition?: string;
  timeframe?: string;
  price?: string;
  form?: string;
}

export type FormStep = 
  | 'initial'
  | 'property-details'
  | 'timeline'
  | 'contact'
  | 'thank-you';

export interface SubmissionResponse {
  success: boolean;
  error?: string;
  message?: string;
  leadId?: string;
}

// UI Component Types
export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  image?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PropertyConditionOption {
  value: string;
  label: string;
  description?: string;
}

export interface TimeframeOption {
  value: string;
  label: string;
  description?: string;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// API Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Re-export from form.ts for backward compatibility
export * from './form';