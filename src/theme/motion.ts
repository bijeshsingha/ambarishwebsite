/**
 * Motion & Animation Design Tokens
 */

export const motionTokens = {
  // Parallax scroll coefficients
  parallax: {
    heroSpeed: 0.3, // Scroll translation factor (0.3 = moves 30% of scroll speed)
    heroScale: 0.00025, // Subtle scale factor on scroll
    bannerSpeed: 0.2,
  },

  // Navbar animation settings
  navbar: {
    scrollThreshold: 120, // Pixels scrolled before auto-hide triggers
    deltaThreshold: 8, // Minimum delta scroll to trigger hide/reveal
    transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
  },

  // Image hover zoom
  imageHover: {
    duration: "duration-700",
    easing: "ease-out",
    scale: "group-hover:scale-105",
  },

  // Standard transitions
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "300ms cubic-bezier(0.16, 1, 0.3, 1)",
    slow: "500ms cubic-bezier(0.16, 1, 0.3, 1)",
    luxury: "700ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
};
