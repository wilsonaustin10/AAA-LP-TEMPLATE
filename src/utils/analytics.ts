export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    // Ensure dataLayer exists before Google script loads and uses it
    window.dataLayer = window.dataLayer || [];

    const script = document.createElement('script');
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);
    
    // The Google script will define window.gtag. We then use it.
    // Our global.d.ts should provide the type for window.gtag.
    // We are assuming that by the time gtag is called, it has been initialized by the script.
    // A more robust solution might involve a callback or promise when the script is loaded.
    
    // Initial gtag calls after script is appended and expected to load/execute.
    if (typeof window.gtag === 'function') {
        window.gtag('js', new Date());
        window.gtag('config', gaId);
        
        if (process.env.NEXT_PUBLIC_GOOGLE_ADS_ID) {
          window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);
        }
    } else {
        // Fallback or error if gtag is not defined shortly after script append
        // This could happen if the script fails to load or is blocked.
        console.warn('gtag function not found after attempting to load Google Analytics script.');
        // Optionally, create a dummy gtag to prevent errors in subsequent calls if necessary
        // window.gtag = (...args) => { console.warn("gtag dummy called:", args); };
    }
  }
};

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};

// Track a Google Ads conversion
export const trackConversion = (conversionId: string, conversionLabel: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      'send_to': `${conversionId}/${conversionLabel}`,
      ...params
    });
  }
}; 