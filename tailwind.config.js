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
        secondary: "#ff5e00d6",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "text-light": "#0d141b",
        "text-dark": "#f6f7f8",
        "card-light": "#ffffff",
        "card-dark": "#182431",
        "border-light": "#e7edf3",
        "border-dark": "#2d3a46",
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;
