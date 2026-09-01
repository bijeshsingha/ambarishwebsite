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
  name: "Hotel Ambarish UI Spec Standard",
  ink: "#0C0B0B",
  warmCream: "#F5EBDD",
  hotelGold: "#B4872F",
  brandMagenta: "#B62576",
  brandMagentaHover: "#9A1D62",
  charcoal: "#171414",

  canvas: "#F5EBDD",
  canvasAlt: "#ECE1D0",
  surface: "#FFFFFF",
  surfaceMuted: "#FAF6F0",
  surfaceDark: "#0C0B0B",

  textPrimary: "#0C0B0B",
  textSecondary: "#3D3734",
  textMuted: "#7A7067",
  textInverted: "#F5EBDD",

  borderHairline: "rgba(12, 11, 11, 0.12)",
  borderGold: "#B4872F",
  borderSubtle: "rgba(180, 135, 47, 0.25)",

  shadowNav: "0 10px 30px rgba(12, 11, 11, 0.35)",
  shadowCard: "0 6px 24px rgba(12, 11, 11, 0.06)",
  shadowFloating: "0 16px 40px rgba(12, 11, 11, 0.12)",
};
