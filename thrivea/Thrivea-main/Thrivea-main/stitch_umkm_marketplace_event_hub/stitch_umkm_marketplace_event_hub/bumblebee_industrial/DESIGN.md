---
name: Bumblebee Industrial
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d0c6ab'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#999077'
  outline-variant: '#4d4732'
  surface-tint: '#e9c400'
  primary: '#fff6df'
  on-primary: '#3a3000'
  primary-container: '#ffd700'
  on-primary-container: '#705e00'
  inverse-primary: '#705d00'
  secondary: '#c6c6c6'
  on-secondary: '#303030'
  secondary-container: '#474747'
  on-secondary-container: '#b5b5b5'
  tertiary: '#f9f5f5'
  on-tertiary: '#313030'
  tertiary-container: '#dcd9d9'
  on-tertiary-container: '#605f5e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe16d'
  primary-fixed-dim: '#e9c400'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
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
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system is built on a foundation of high-energy industrialism and uncompromising clarity. It targets a modern marketplace demographic that values efficiency, speed, and bold decision-making. By leveraging a high-contrast "Bumblebee" palette, the UI commands attention and creates a sense of urgency and premium utility.

The aesthetic blends **High-Contrast/Bold** movements with **Minimalist** structural discipline. Surfaces are predominantly dark to allow the vibrant yellow accents to "pop" with maximum luminance, evoking the feel of heavy machinery, high-end automotive interfaces, and professional-grade tools. The emotional response is one of confidence, power, and streamlined navigation.

## Colors

The color strategy relies on a strict hierarchical application of the "Bumblebee" theme. 

- **Primary (#FFD700):** Reserved exclusively for primary actions, critical alerts, and brand signifiers. It must maintain a high contrast ratio against the black background.
- **Secondary (#000000):** The primary canvas color. It provides the "void" that makes the yellow elements vibrate with energy.
- **Tertiary (#1A1A1A):** Used for elevated surfaces, cards, and section containers to create subtle depth without breaking the high-contrast aesthetic.
- **Neutral (#F4F4F4):** Used for primary body text and icons on dark backgrounds to ensure AAA accessibility.

## Typography

This design system utilizes **Plus Jakarta Sans** across all levels to maintain a modern, geometric, and approachable feel that balances the aggressive color palette. 

Headlines use heavy weights (700-800) and tight letter-spacing to mimic industrial signage. Body text is kept clean with generous line-heights to ensure readability against dark backgrounds. Label styles often utilize uppercase styling and increased tracking to differentiate functional UI metadata from narrative content.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model on desktop (12 columns, 1200px max-width) and a **Fluid Grid** on mobile (4 columns). 

The spacing rhythm is strictly based on a 4px baseline grid. Large "Industrial" gutters (20px-24px) are used to prevent the high-contrast elements from feeling cluttered. Elements should span clear column counts to maintain a structured, engineering-led appearance.

## Elevation & Depth

In this dark-themed design system, elevation is conveyed through **Tonal Layers** rather than shadows. 

1.  **Level 0 (Background):** Pure Black (#000000).
2.  **Level 1 (Cards/Sections):** Deep Charcoal (#1A1A1A).
3.  **Level 2 (Modals/Popovers):** Dark Grey (#2A2A2A) with a subtle 1px stroke of #333333.

Shadows, when used, are "Hard Shadows" with 0 blur and 100% opacity, slightly offset to reinforce the brutalist/industrial aesthetic. Glossy overlays or blurs are avoided to maintain the "solid" feel of the interface.

## Shapes

The shape language is **Soft** but disciplined. A 0.25rem (4px) base radius is applied to buttons and inputs to prevent the UI from feeling dangerously sharp while maintaining its technical edge. 

Larger containers (Cards) use a 0.5rem (8px) radius. Significant structural components like hero images may remain sharp (0px) to enhance the industrial aesthetic.

## Components

- **Buttons:** Primary buttons are Solid Yellow (#FFD700) with Black text. Secondary buttons are Outline Yellow with Yellow text. Interaction states should involve a "Negative" flip (Black background with Yellow text).
- **Inputs:** Dark surfaces (#1A1A1A) with a 1px Yellow border on focus. Placeholders are low-contrast grey; active text is White.
- **Chips:** High-contrast tags with Black backgrounds and Yellow borders, or vice-versa for "active" states.
- **Lists:** Separated by thin 1px lines (#2A2A2A) to maintain the grid-like structure.
- **Cards:** No shadows. Depth is created by the contrast between Level 0 and Level 1 backgrounds.
- **Badges:** Small, circular or pill-shaped accents in Primary Yellow to denote counts or new items.
- **Navigation:** Top-tier navigation uses heavy weights and uppercase labels to act as a structural anchor for the page.