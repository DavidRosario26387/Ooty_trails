import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tourism theme — Ooty hills / tea estates greens + warm orange accent
        brand: {
          50: "#eefbf3",
          100: "#d6f5e0",
          200: "#b0e9c5",
          300: "#7ed6a3",
          400: "#46bd7c",
          500: "#22a25f", // primary green
          600: "#15834b",
          700: "#12683d",
          800: "#125234",
          900: "#10432c",
          950: "#072517",
        },
        accent: {
          50: "#fff6ed",
          100: "#ffead0",
          200: "#fdd0a0",
          300: "#fcb066",
          400: "#fa8c32",
          500: "#f7700f", // warm orange accent
          600: "#e85605",
          700: "#c03f08",
          800: "#98330e",
          900: "#7a2c0f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(16, 67, 44, 0.18)",
        soft: "0 4px 20px -6px rgba(16, 67, 44, 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
