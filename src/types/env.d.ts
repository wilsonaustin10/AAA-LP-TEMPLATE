declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Google APIs
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      
      // Branding
      NEXT_PUBLIC_LOGO_URL?: string;
      NEXT_PUBLIC_COMPANY_NAME?: string;
      NEXT_PUBLIC_PHONE_NUMBER?: string;
      NEXT_PUBLIC_EMAIL?: string;
      
      // Analytics
      NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
      NEXT_PUBLIC_GA_ADS_ID?: string;
      NEXT_PUBLIC_FB_PIXEL_ID?: string;
      NEXT_PUBLIC_HOTJAR_ID?: string;
      
      // Service Areas
      NEXT_PUBLIC_SERVICE_AREAS?: string;
      
      // ReCAPTCHA
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string;
      RECAPTCHA_SECRET_KEY?: string;
      
      // Go High Level Integration
      NEXT_PUBLIC_GHL_ENDPOINT?: string;
      GHL_API_KEY?: string;
      
      // Google Sheets Integration
      GOOGLE_SHEETS_API_KEY?: string;
      GOOGLE_SHEETS_CLIENT_EMAIL?: string;
      GOOGLE_SHEETS_PRIVATE_KEY?: string;
    }
  }
}

export {};