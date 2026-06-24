import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        background: {
          light: "#F8FAFC",
          dark: "#111827",
        },
        foreground: {
          light: "#111827",
          dark: "#F8FAFC",
        },
        surface: {
          light: "rgba(255, 255, 255, 0.7)",
          dark: "rgba(17, 24, 39, 0.7)",
        },
        border: {
          light: "rgba(0, 0, 0, 0.05)",
          dark: "rgba(255, 255, 255, 0.05)",
        },
        primary: {
          DEFAULT: "#4F46E5", // Indigo
          hover: "#4338CA",
        },
        secondary: {
          DEFAULT: "#2563EB", // Blue
          hover: "#1D4ED8",
        },
        accent: {
          DEFAULT: "#10B981", // Emerald
          hover: "#059669",
        }
      },
      animation: {
        "blob": "blob 10s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        }
      },
    },
  },
  plugins: [],
};
export default config;
