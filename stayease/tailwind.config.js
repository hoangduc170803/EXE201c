/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#2b8cee",
        "background-light": "#ffffff",
        "background-dark": "#101922",
        "surface-light": "#f6f7f8",
        "surface-dark": "#1a2632",
      },
      fontFamily: {
        display: ["Be Vietnam Pro", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        hover: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
}

