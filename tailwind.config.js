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
        primary: '#1a73e8', // Default blue, can be overridden
        secondary: '#34a853', // Default green, can be overridden
        accent: '#000000', // COMPANY ACCENT COLOR PLACEHOLDER
        highlight: '#000000', // COMPANY HIGHLIGHT COLOR PLACEHOLDER
        background: '#ffffff', // White
        text: '#333333', // Dark gray for regular text
        footer: {
          bg: '#1a73e8', // Same as primary
          text: '#ffffff', // White
          hover: '#34a853', // Same as secondary
        }
      },
    },
  },
  plugins: [],
}; 