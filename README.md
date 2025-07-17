# AAA-LANDING PAGE-TEMPLATE

A responsive Next.js 15 landing page for collecting property information from potential sellers, integrated with multiple CRM systems for lead management.

## Quick Start

### Prerequisites
- Node.js 18.x or higher (recommended: 20.x)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd AAA-LP-Template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local` (see Environment Variables section below)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Common Issues and Solutions

### Logo Not Appearing
- Ensure `NEXT_PUBLIC_LOGO_URL` is properly configured in `.env.local`
- If using external image hosting, verify the domain is added to `next.config.js`
- Check browser console for any image loading errors

### Script Loading Errors
- Scripts with event handlers must be in client components
- Google Maps and Analytics scripts are handled by the `ClientScripts` component
- Ensure your Google Maps API key has the correct permissions

### Next.js Version Conflicts
- This template uses Next.js 15.x
- If you have a global Next.js installation, the project version takes precedence
- Run `npx next --version` to verify you're using the correct version

## Environment Variables

The application uses environment variables for configuration. Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

### Required Environment Variables

```bash
# Google Maps API (required for address autocomplete)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Branding Configuration

```bash
# Company branding
NEXT_PUBLIC_LOGO_URL=https://your-domain.com/logo.png
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
NEXT_PUBLIC_PHONE_NUMBER=+1234567890
NEXT_PUBLIC_EMAIL=contact@yourcompany.com
```

### Analytics & Tracking (Optional)

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_ADS_ID=AW-XXXXXXXXX

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=YOUR_FACEBOOK_PIXEL_ID

# Hotjar
NEXT_PUBLIC_HOTJAR_ID=YOUR_HOTJAR_ID
```

### CRM Integration

```bash
# Go High Level
NEXT_PUBLIC_GHL_ENDPOINT=https://your-webhook-url
GHL_API_KEY=your-api-key

# Service Areas (JSON array)
NEXT_PUBLIC_SERVICE_AREAS=["California","Nevada","Arizona"]

## API Key Security

- Never commit actual API keys to the repository
- The `.env` file is included in `.gitignore` to prevent accidental commits
- For production, set environment variables through your hosting provider (Vercel)
- Restrict API keys to specific domains and services when possible:
  - Google Maps API key should have website restrictions set to your domain
  - Set appropriate quotas to prevent unexpected billing

## Google Maps Integration

For the Google Maps/Places API integration to work:

1. Create a project in Google Cloud Console
2. Enable the Maps JavaScript API and Places API
3. Create an API key with HTTP referrer restrictions
4. Add your domain(s) to the allowed referrers list
5. Add the API key to your environment variables

## Zapier Integration

The form submissions are sent to Zapier for processing:

1. Create a Zap with a Webhook trigger (Catch Hook)
2. Copy the webhook URL to your environment variables
3. Configure Zapier actions to handle the form data (e.g., add to CRM, send notifications) 