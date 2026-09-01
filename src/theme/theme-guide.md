# Theme & Design System Guide

All design tokens, color variants, motion parameters, and typography rules are organized inside `src/theme/`.

## 📁 File Structure

```
src/theme/
├── index.ts                # Master entry point & active theme switcher
├── typography.ts           # Font families, sizes, and letter-spacing tokens
├── motion.ts               # Parallax coefficients & navbar animation timings
└── variants/
    ├── warm-luxury.ts      # Active Default (Warm linen, crisp white, antique brass)
    ├── dark-editorial.ts   # Dark Theme (Midnight black, charcoal, gold)
    └── modern-minimal.ts   # Gallery Theme (Ultra-clean modern white & grey)
```

---

## 🎨 How to Experiment with Designs

### 1. Switching Between Pre-built Themes
Open `src/theme/index.ts` and change `ACTIVE_THEME_KEY`:
```typescript
// Options: 'warm-luxury' | 'dark-editorial' | 'modern-minimal'
export const ACTIVE_THEME_KEY: ThemeVariant = "warm-luxury";
```

### 2. Creating a Custom Theme Variant
1. Duplicate any file in `src/theme/variants/` (e.g. `src/theme/variants/my-custom-theme.ts`).
2. Customize the colors, borders, and shadows.
3. Register it in `src/theme/index.ts`.

### 3. Adjusting Motion & Parallax Speeds
Open `src/theme/motion.ts` to tweak:
- `parallax.heroSpeed` (default: `0.3`)
- `navbar.scrollThreshold` (default: `120` pixels)
- Transition easing curves

### 4. Adjusting Typography
Open `src/theme/typography.ts` to adjust font pairings, letter-spacings, and heading sizes.
