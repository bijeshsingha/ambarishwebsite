/**
 * Master Theme Configuration & Switcher
 * To change the active design theme, simply update ACTIVE_THEME below.
 */

import { warmLuxuryTheme, ThemeColors } from "./variants/warm-luxury";
import { darkEditorialTheme } from "./variants/dark-editorial";
import { modernMinimalTheme } from "./variants/modern-minimal";
import { motionTokens } from "./motion";
import { typographyTokens } from "./typography";

export type ThemeVariant = "warm-luxury" | "dark-editorial" | "modern-minimal";

// 👉 ACTIVE THEME SWITCHER: Change this value to switch the design instantly!
export const ACTIVE_THEME_KEY: ThemeVariant = "warm-luxury";

export const THEME_REGISTRY: Record<ThemeVariant, ThemeColors> = {
  "warm-luxury": warmLuxuryTheme,
  "dark-editorial": darkEditorialTheme,
  "modern-minimal": modernMinimalTheme,
};

export const activeTheme: ThemeColors = THEME_REGISTRY[ACTIVE_THEME_KEY];

export { warmLuxuryTheme, darkEditorialTheme, modernMinimalTheme, motionTokens, typographyTokens };
export type { ThemeColors };
