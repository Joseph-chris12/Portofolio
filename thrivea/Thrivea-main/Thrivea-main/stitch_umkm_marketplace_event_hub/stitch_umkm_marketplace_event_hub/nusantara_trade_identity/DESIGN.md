---
name: Nusantara Trade Identity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#474651'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777682'
  outline-variant: '#c8c5d3'
  surface-tint: '#5654a8'
  primary: '#1a146b'
  on-primary: '#ffffff'
  primary-container: '#312e81'
  on-primary-container: '#9c9af4'
  inverse-primary: '#c3c0ff'
  secondary: '#006d36'
  on-secondary: '#ffffff'
  secondary-container: '#6dfe9c'
  on-secondary-container: '#007439'
  tertiary: '#1c2437'
  on-tertiary: '#ffffff'
  tertiary-container: '#31394e'
  on-tertiary-container: '#9ba3bc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100563'
  on-primary-fixed-variant: '#3e3c8f'
  secondary-fixed: '#6dfe9c'
  secondary-fixed-dim: '#4de082'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005227'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
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
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is engineered for a high-stakes trade and logistics environment where precision meets modern agility. The brand personality is **authoritative yet revitalized**, balancing the institutional weight of global commerce with the technological freshness of a digital-first platform.

The aesthetic follows a **Modern Corporate** approach with **Minimalist** influences. It prioritizes clarity and density without feeling cluttered. The visual language uses deep, stable tones to establish trust, while the mint accents introduce a "pulse" to the UI, signaling activity, growth, and successful operations. The emotional response should be one of total control and effortless efficiency.

## Colors

The palette is anchored by **Deep Indigo**, providing a foundation of stability and professional rigor. This is contrasted by **Mint**, which serves as the primary engine for interactivity and success states.

- **Primary (Deep Indigo):** Used for navigation, primary headers, and critical call-to-actions. It represents the "infrastructure" of the system.
- **Secondary (Mint):** Used for secondary actions, "active" indicators, and success highlights. To ensure WCAG 2.1 accessibility, Mint should be used as a background for dark text or as a non-text decorative element. For text-based success states, a slightly darkened Mint is preferred.
- **Neutrals:** A cool-toned slate palette maintains the professional atmosphere and prevents the UI from feeling "muddy."

## Typography

This design system utilizes a dual-font strategy to separate information hierarchy from functional utility.

**Hanken Grotesk** is used for headlines and display elements. Its sharp, contemporary geometry feels precise and forward-looking. **Inter** is used for all body copy, data tables, and labels, chosen for its exceptional legibility in data-heavy environments.

For mobile, headlines scale down to prevent awkward wrapping, while body sizes remain constant to ensure readability. Tracking is tightened on large display headers and slightly loosened on small uppercase labels to improve scanability.

## Layout & Spacing

The layout is built on a **12-column fluid grid** for desktop, transitioning to 8 columns for tablet and 4 columns for mobile. 

We employ a **fixed 8px baseline rhythm** for all vertical spacing. Content is housed within structured containers to maintain order in complex workflows.
- **Gutter:** 24px across all screen sizes to ensure data columns remain distinct.
- **Safe Margins:** 32px on desktop to provide breathing room; reduced to 16px on mobile.
- **Density:** In data-rich views (like trade ledgers), spacing can be toggled to a "Compact" mode, reducing the base unit to 4px.

## Elevation & Depth

Visual hierarchy is established primarily through **Tonal Layering** and **Low-Contrast Outlines**. 

To maintain a professional, flat-modern aesthetic, shadows are used sparingly. When used, they are "Ambient Shadows"—diffused, low-opacity (#0F172A at 8%), and slightly shifted downward to simulate a natural light source.

Higher elevation levels (like modals or dropdowns) use a subtle **Deep Indigo tint** in the shadow to unify the depth with the brand's primary color. Surfaces use a hierarchical grayscale: 
1. **Background:** Soft gray (#F8FAFC)
2. **Surface:** Pure white (#FFFFFF)
3. **Overlay:** Pure white with a 1px border (#E2E8F0)

## Shapes

The shape language is **Soft (Level 1)**. This choice reflects a balance between the "hard" precision of the trade industry and the "soft" user-friendly nature of modern SaaS.

- **Standard Elements:** 0.25rem (4px) corner radius for buttons and input fields.
- **Large Elements:** 0.5rem (8px) for cards and modals.
- **Contextual Shapes:** Badges and status chips use a fully rounded "pill" shape (999px) to contrast against the structured rectangular grid of the layout.

## Components

### Buttons
- **Primary:** Deep Indigo background with white text. High-contrast, sharp 4px corners.
- **Secondary:** Mint background with Deep Indigo text. Used for "Add," "Export," or "Confirm" actions.
- **Ghost:** Transparent background with 1px Deep Indigo border or Mint text for subtle utility.

### Chips & Status Indicators
Status chips are critical. "Completed" or "Active" states use a Mint background (20% opacity) with a darkened Mint text to ensure high contrast. "Pending" states use a neutral slate.

### Input Fields
Inputs use a white background with a 1px Slate-200 border. On focus, the border transitions to Deep Indigo with a subtle Mint outer glow (2px spread) to indicate the active state.

### Data Cards
Cards should have no shadow by default, instead using a 1px border (#E2E8F0). The header of a card can feature a thin 3px vertical Mint accent on the left edge to denote "active" or "live" data.

### Progress Bars
Track background is Slate-100; the indicator is a solid Mint gradient to imply movement and successful progression.