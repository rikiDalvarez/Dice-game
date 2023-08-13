/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
      keyframes: {
        wave: {
          '0%': { backgroundColor: 'green' },
          '10%': { backgroundColor: 'blue' },
          '20%': { backgroundColor: 'purple' },
          '30%': { backgroundColor: 'red' },
          '40%': { backgroundColor: 'orange' },
          '50%': { backgroundColor: 'yellow' },
          '60%': { backgroundColor: 'white' },
          '100%': { backgroundColor: 'dark' },
        },
      },
      animation: {
        'changinColor': 'wave 2s linear infinite',
      },
    },
  },
  plugins: [],
}

