/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/@fluid-design/fluid-ui/dist/index.mjs',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        // Primary palette for Fluid UI. Every Fluid component derives its accent from it.
        // Steps 600+ meet 4.5:1 against white; 300 and lighter meet 4.5:1 against gray-900.
        primary: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcdaff',
          300: '#8ec3ff',
          400: '#59a1ff',
          500: '#337dfc',
          600: '#1d5ef1',
          700: '#1549de',
          800: '#183db4',
          900: '#1a388e',
        },
        // Fluid UI's recommended neutral ramp.
        gray: {
          50: '#f4f7fb',
          100: '#d8dbdf',
          200: '#bdc0c4',
          300: '#a2a5a9',
          400: '#888b8f',
          500: '#6f7276',
          600: '#575a5d',
          700: '#404346',
          800: '#2b2d30',
          900: '#17191c',
        },
      },
    },
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('@fluid-design/fluid-ui/dist/plugin/core'),
    require('@fluid-design/fluid-ui/dist/plugin/button'),
  ],
};
