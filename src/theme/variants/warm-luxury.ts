/**
 * Theme: Specification Standard — Hotel Ambarish UI Experience Blueprint v1.0
 * Colors:
 * - Ink: #0C0B0B (Floating nav, footer, high-contrast text, image overlays)
 * - Warm Cream: #F5EBDD (Page background canvas, calm section bands, card surfaces)
 * - Hotel Gold: #B4872F (Rules, focus details, icons, quiet emphasis)
 * - Brand Magenta: #B62576 (Primary booking action and active-state accent only)
 * - Charcoal: #171414 (Secondary dark panels and modal surfaces)
 */

export interface ThemeColors {
  name: string;
  ink: string;
  warmCream: string;
  hotelGold: string;
  brandMagenta: string;
  brandMagentaHover: string;
  charcoal: string;

  canvas: string;
  canvasAlt: string;
  surface: string;
  surfaceMuted: string;
  surfaceDark: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverted: string;

  borderHairline: string;
  borderGold: string;
  borderSubtle: string;

  shadowNav: string;
  shadowCard: string;
  shadowFloating: string;
}

export const warmLuxuryTheme: ThemeColors = {
  name: "Warm Heritage Hospitality",
  ink: "#1C1917",
  warmCream: "#FAF8F5",
  hotelGold: "#8F6B2A",
  brandMagenta: "#8F6B2A",
  brandMagentaHover: "#73541E",
  charcoal: "#292524",

  canvas: "#FAF8F5",
  canvasAlt: "#F4EFE6",
  surface: "#FFFFFF",
  surfaceMuted: "#FAF5EB",
  surfaceDark: "#1C1917",

  textPrimary: "#1C1917",
  textSecondary: "#44403C",
  textMuted: "#78716C",
  textInverted: "#FAF8F5",

  borderHairline: "#E7E2D9",
  borderGold: "#8F6B2A",
  borderSubtle: "#DFD5C0",

  shadowNav: "0 4px 20px rgba(28, 25, 23, 0.06)",
  shadowCard: "0 4px 16px rgba(28, 25, 23, 0.05)",
  shadowFloating: "0 12px 32px rgba(28, 25, 23, 0.10)",
};
