/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#eef1f8',
          100: '#dbe2ee',
          500: '#6b7690',
          600: '#1f2a44',
          700: '#161d2e',
          800: '#0f1522',
          900: '#0a0e17',
          950: '#05070d',
        },
        shelf: {
          50: '#eef4ff',
          100: '#dbe7ff',
          200: '#b3ceff',
          300: '#80acff',
          400: '#4d84ff',
          500: '#2f66f0',
          600: '#1d4ed8',
          700: '#1739a6',
          800: '#152c7c',
          900: '#0f1e57',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'shelf-glow': 'radial-gradient(circle at top, rgba(47,102,240,0.25), transparent 60%)',
        'spine-lines': 'repeating-linear-gradient(90deg, rgba(96,165,250,0.06) 0px, rgba(96,165,250,0.06) 1px, transparent 1px, transparent 28px)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(96,165,250,0.15), 0 8px 30px -8px rgba(29,78,216,0.45)',
      },
    },
  },
  plugins: [],
};
