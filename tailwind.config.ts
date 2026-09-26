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
        // Warm Heritage Hospitality Color Tokens
        "ink": "#1C1917",
        "charcoal": "#292524",
        "warm-cream": "#FAF8F5",
        "warm-cream-alt": "#F4EFE6",
        "hotel-gold": "#8F6B2A",
        "hotel-gold-light": "#B3863E",
        "hotel-gold-dark": "#73541E",
        "brand-magenta": "#8F6B2A",
        "brand-magenta-dark": "#73541E",

        // Semantic surface mapping
        "canvas": "#FAF8F5",
        "canvas-alt": "#F4EFE6",
        "surface": "#FFFFFF",
        "surface-tint": "#FAF5EB",
        "surface-dark": "#1C1917",
        "stone-border": "#E7E2D9",
        "stone-border-light": "#F0ECE4",
        "bronze": "#8F6B2A",
        "bronze-dark": "#73541E",
        "bronze-light": "#B3863E",
        "ivory": "#FAF8F5",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "'Cormorant Garamond'", "'Playfair Display'", "Georgia", "serif"],
        sans: ["var(--font-inter)", "'Inter'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
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
