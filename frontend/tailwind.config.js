/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBackground: "#121212",
        darkCard: "#1e1e1e",
        darkText: "#ffffff",
        accent: "#bb86fc",
      },
    },
  },
  plugins: [],
}