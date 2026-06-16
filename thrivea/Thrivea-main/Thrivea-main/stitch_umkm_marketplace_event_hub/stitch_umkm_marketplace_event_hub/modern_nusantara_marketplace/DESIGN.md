---
name: Modern Nusantara Marketplace
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#3e4949'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#6e7979'
  outline-variant: '#bdc9c8'
  surface-tint: '#006a6a'
  primary: '#006565'
  on-primary: '#ffffff'
  primary-container: '#008080'
  on-primary-container: '#e3fffe'
  inverse-primary: '#76d6d5'
  secondary: '#9d4311'
  on-secondary: '#ffffff'
  secondary-container: '#fe8d56'
  on-secondary-container: '#702900'
  tertiary: '#5b5a55'
  on-tertiary: '#ffffff'
  tertiary-container: '#74726d'
  on-tertiary-container: '#fcf8f2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#93f2f2'
  primary-fixed-dim: '#76d6d5'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f4f'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb595'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7c2e00'
  tertiary-fixed: '#e6e2dc'
  tertiary-fixed-dim: '#c9c6c1'
  on-tertiary-fixed: '#1c1c18'
  on-tertiary-fixed-variant: '#484743'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1200px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system embodies the "Modern Nusantara" aesthetic—a synthesis of Indonesia's rich cultural warmth and the precision of contemporary digital commerce. It is designed specifically for MSMEs (UMKM), balancing the accessibility required for local micro-entrepreneurs with the high-quality standards expected by modern consumers.

The visual direction is **Modern / Corporate**, leaning into a friendly yet professional atmosphere. It prioritizes trust, reliability, and growth. By utilizing soft cream backgrounds instead of stark white, the UI feels more approachable and grounded, reflecting the communal "gotong royong" spirit of Indonesian business. The interface remains clean and uncluttered, ensuring that product photography—the lifeblood of any marketplace—is the hero.

## Colors

The color palette is rooted in the natural and institutional landscape of Indonesia:

*   **Trustworthy Teal (#008080):** The primary color, representing stability, growth, and professional integrity. Used for primary actions, branding, and active states.
*   **Warm Terracotta (#CC6633):** The secondary accent, inspired by traditional clay pottery and earth tones. Used sparingly for highlights, sales tags, and "Add to Cart" actions to create warmth and urgency without aggression.
*   **Soft Cream (#FDF9F3):** The primary background color. It reduces eye strain compared to pure white and provides a "paper-like" quality that feels premium and organic.
*   **Deep Charcoal (#2D2D2D):** Used for typography and iconography to ensure high legibility and a grounded, authoritative feel.
*   **Semantic Colors:** Success (Emerald), Warning (Amber), and Error (Crimson) should be slightly desaturated to harmonize with the cream and teal palette.

## Typography

**Plus Jakarta Sans** is the exclusive typeface for this design system. Its modern, slightly rounded geometric forms provide a contemporary Indonesian identity that is both friendly and highly legible across mobile and desktop devices.

Headlines use a tighter letter-spacing and heavier weights to establish a clear hierarchy, while body text maintains generous line-heights for comfortable reading of product descriptions. Labels for navigation and tags utilize semi-bold weights to remain distinct even at smaller sizes.

## Layout & Spacing

The design system utilizes an **8px base grid** to ensure consistency across all components.

*   **Grid Model:** A 12-column fluid grid for desktop and a 4-column grid for mobile.
*   **Margins:** 16px on mobile to maximize screen real estate for product images; 32px or more on desktop to allow the Soft Cream background to provide "breathing room."
*   **Responsive Behavior:** On mobile, product grids should transition to a 2-column layout to maintain image clarity. On desktop, cards may span 3 or 4 columns depending on the category.
*   **Alignment:** Content should be centered within a max-width container of 1200px on ultra-wide screens to maintain readability.

## Elevation & Depth

Depth is achieved through a combination of **Tonal Layering** and **Ambient Shadows**.

1.  **Level 0 (Background):** Soft Cream (#FDF9F3). Used for the canvas.
2.  **Level 1 (Cards/Surfaces):** Pure White (#FFFFFF). Product cards and containers sit on the cream background, creating a subtle natural lift even without shadows.
3.  **Level 2 (Interactive):** Elements that require focus (like active Search Bars or Hovered Cards) use a very soft, diffused shadow: `0 4px 20px rgba(0, 128, 128, 0.08)`. The teal tint in the shadow keeps the depth feeling "branded" rather than muddy.
4.  **Level 3 (Modals/Overlays):** Higher elevation with a more pronounced shadow to separate critical actions from the marketplace flow.

## Shapes

The shape language is defined by **Rounded (0.5rem)** corners. This level of roundedness avoids the childish feel of pill-shapes while moving away from the coldness of sharp edges.

*   **Standard Components:** Buttons, Input Fields, and Checkboxes use 0.5rem (8px).
*   **Large Containers:** Product Cards and Modals use `rounded-lg` (16px) to emphasize the soft, modern aesthetic.
*   **Product Media:** Images should always follow the container's roundedness to ensure a cohesive look.

## Components

### Buttons
*   **Primary:** Solid Trustworthy Teal with White text. High emphasis.
*   **Secondary:** Ghost style with Teal border and text. Low-to-medium emphasis.
*   **Accent:** Solid Warm Terracotta for "Add to Cart" or "Buy Now" to drive conversion.

### Cards
*   Product cards are the core component. They feature a white background, 16px corner radius, and a 1px very light teal border (`rgba(0, 128, 128, 0.1)`) instead of heavy shadows for a cleaner look.

### Input Fields
*   Outlined style with a 1px border. The border turns Teal on focus. Labels should sit above the field in `label-md` style.

### Chips & Tags
*   Used for categories (e.g., "Sembako," "Kerajinan"). These should have a light teal background (`rgba(0, 128, 128, 0.05)`) and Teal text.

### Navigation
*   **Mobile:** A bottom navigation bar with clear, labeled Deep Charcoal icons.
*   **Desktop:** A persistent top header with a centered, prominent search bar to facilitate easy product discovery.

### MSME Support Badge
*   A specific "UMKM Asli" badge component using the Warm Terracotta color and a small icon to highlight local sellers, building consumer trust.