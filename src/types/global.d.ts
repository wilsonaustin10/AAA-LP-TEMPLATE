declare global {
  interface Window {
    pageLoadTime?: number;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    hj?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// This export is necessary to make this a module and allow global augmentation
export {}; 