// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#ffffff",
          text: "#000000",
          card: "#ffffff",
          border: "#e5e7eb",
          hover: "#f3f4f6",
        },
        dark: {
          background: "#111827",
          text: "#f3f4f6",
          card: "#1f2937",
          border: "#374151",
          hover: "#374151",
        },
      },
    },
  },
  plugins: [],
};
