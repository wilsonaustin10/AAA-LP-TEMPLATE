/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'COMPANY PRIMARY COLOR PLACEHOLDER',
        secondary: 'COMPANY SECONDARY COLOR PLACEHOLDER',
        accent: '#000000', // COMPANY ACCENT COLOR PLACEHOLDER
        highlight: '#000000', // COMPANY HIGHLIGHT COLOR PLACEHOLDER
        background: '#ffffff', // White
        text: '#333333', // Dark gray for regular text
        footer: {
          bg: '#0eb9c6', // Teal
          text: '#ffffff', // White
          hover: '#f76547', // Orange-red
        }
      },
    },
  },
  plugins: [],
}; 