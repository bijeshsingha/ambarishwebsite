/**
 * Typography Design Tokens
 */

export const typographyTokens = {
  fontFamilies: {
    serif: "var(--font-cormorant), Georgia, serif",
    sans: "var(--font-inter), system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  letterSpacing: {
    tighter: "-0.04em",
    tight: "-0.02em",
    normal: "-0.01em",
    wide: "0.05em",
    wider: "0.14em",
    widest: "0.2em",
  },
  headings: {
    h1: "font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight",
    h2: "font-serif text-3xl sm:text-5xl font-normal leading-tight tracking-tight",
    h3: "font-serif text-2xl sm:text-3xl font-normal leading-snug",
    h4: "font-serif text-xl font-normal leading-snug",
  },
  labels: {
    categoryBadge: "text-[10px] font-mono uppercase tracking-widest",
    sectionEyebrow: "text-[11px] font-semibold tracking-[0.2em] uppercase text-[#A27520] block",
    actionButton: "text-xs font-bold uppercase tracking-[0.14em]",
  },
};
