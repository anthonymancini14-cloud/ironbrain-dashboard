/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'steel': {
          900: '#0a0e1a',
          800: '#111827',
          700: '#1a2332',
          600: '#243044',
          500: '#2e3f58',
        },
        'accent': '#4a9eff',
        'status-green': '#22c55e',
        'status-yellow': '#eab308',
        'status-red': '#ef4444',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-status-green', 'bg-status-yellow', 'bg-status-red',
    'text-status-green', 'text-status-yellow', 'text-status-red',
    'border-status-green', 'border-status-yellow', 'border-status-red',
  ],
}
