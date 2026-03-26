/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cockpit: {
          bg:           '#030d07',
          panel:        '#050f09',
          deep:         '#001a07',
          border:       '#0d3318',
          'border-hot': '#00ff41',
          header:       '#071a0c',
        },
        phosphor: {
          bright:  '#00ff41',
          mid:     '#00cc34',
          dim:     '#00882a',
          dark:    '#003010',
          glow:    '#00ff4133',
        },
        amber: {
          bright:  '#ffaa00',
          hot:     '#ff8c00',
          dim:     '#664400',
        },
        alert: {
          red:       '#ff2020',
          'red-dim': '#4a0000',
        },
        cockpit_white: '#d4f0d4',
        muted:         '#2a4a2f',
        // Keep legacy colors so any remaining uses don't break
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
      fontFamily: {
        cockpit: ['"JetBrains Mono"', '"IBM Plex Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        phosphor:      '0 0 8px rgba(0,255,65,0.4)',
        'phosphor-lg': '0 0 20px rgba(0,255,65,0.25)',
        amber:         '0 0 8px rgba(255,170,0,0.5)',
        panel:         'inset 0 0 30px rgba(0,0,0,0.6)',
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
