/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pacific': '#5C9EAD',
        'tangerine': '#E39774',
        'slate-blue': '#326273',
        'platinum': '#EEEEEE',
      }
    },
  },
  plugins: [],
}