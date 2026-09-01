import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Spec 2.1 Color Tokens
        "ink": "#0C0B0B",
        "charcoal": "#171414",
        "warm-cream": "#F5EBDD",
        "warm-cream-alt": "#ECE1D0",
        "hotel-gold": "#B4872F",
        "hotel-gold-light": "#CFA44C",
        "hotel-gold-dark": "#8F671E",
        "brand-magenta": "#B62576",
        "brand-magenta-dark": "#9A1D62",

        // Semantic surface mapping
        "canvas": "#F5EBDD",
        "surface": "#FFFFFF",
        "surface-dark": "#0C0B0B",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "nav": "0 10px 30px rgba(12, 11, 11, 0.35)",
        "card": "0 6px 24px rgba(12, 11, 11, 0.06)",
        "card-hover": "0 14px 36px rgba(12, 11, 11, 0.10)",
        "floating": "0 16px 40px rgba(12, 11, 11, 0.12)",
      },
      borderRadius: {
        "card": "18px",
        "nav": "22px",
        "btn": "14px",
      },
    },
  },
  plugins: [],
};

export default config;
