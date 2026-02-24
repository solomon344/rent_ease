import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "text-light": "#0d141b",
        "text-dark": "#f6f7f8",
        "card-light": "#ffffff",
        "card-dark": "#182431",
        "border-light": "#e7edf3",
        "border-dark": "#2d3a46",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;
