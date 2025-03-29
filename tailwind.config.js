/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: 'hsl(263.4, 70%, 50.4%)',
            foreground: 'hsl(0, 0%, 100%)',
          },
          background: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(240, 10%, 3.9%)',
          // Ludo-specific colors
          red: {
            100: '#ffebee',
            500: '#f44336',
            600: '#e53935',
          },
          green: {
            100: '#e8f5e9',
            500: '#4caf50',
            600: '#43a047',
          },
          blue: {
            100: '#e3f2fd',
            500: '#2196f3',
            600: '#1e88e5',
          },
          yellow: {
            100: '#fffde7',
            500: '#ffeb3b',
            600: '#fdd835',
          },
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
      },
    },
    plugins: [
      require('tailwindcss-animate'),
      require('@tailwindcss/line-clamp')
    ],
  };