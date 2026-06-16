---
name: Nusantara Trade System
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
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#372000'
  on-tertiary: '#ffffff'
  tertiary-container: '#543300'
  on-tertiary-container: '#e49200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100563'
  on-primary-fixed-variant: '#3e3c8f'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
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
    fontWeight: '700'
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
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-xs: 4px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
  stack-xl: 80px
---

## Brand & Style

The design system is engineered to empower Indonesian UMKM (MSMEs) by blending professional credibility with modern digital accessibility. The brand personality is **Trustworthy, Empowering, and Precise**, designed to make local entrepreneurs feel like global competitors.

The aesthetic follows a **Modern Corporate** style with **Minimalist** influences. It prioritizes clarity and "breathability" through generous whitespace, ensuring that product imagery—the heartbeat of any marketplace—remains the focal point. The interface avoids unnecessary ornamentation, opting instead for refined functional elements that signal stability and technological sophistication. The target audience ranges from traditional craftspeople to tech-savvy urban resellers, requiring a UI that is both intuitive and high-performing.

## Colors

The palette is anchored by **Deep Indigo (#312E81)**, a color that evokes the reliability of established financial institutions and the depth of Indonesian maritime heritage. This is paired with **Mint (#10B981)** as a secondary accent to represent growth, fresh opportunities, and success.

- **Primary (Deep Indigo):** Used for navigation, primary actions, and brand-critical moments.
- **Secondary (Mint):** Used for "Success" states, growth indicators, and secondary call-to-actions that require a friendly, positive touch.
- **Tertiary (Amber):** Used sparingly for warnings or to highlight "Limited Edition" or "Featured" UMKM products.
- **Neutral:** A slate-based neutral scale ensures that text remains legible and secondary interface elements (like borders and icons) don't compete with content.
- **Background:** A crisp white (#FFFFFF) foundation with subtle off-white (#F8FAFC) sectioning to maintain a clean, airy feel.

## Typography

The design system exclusively utilizes **Plus Jakarta Sans**, a contemporary typeface that mirrors the vibrant energy of Indonesia’s modern economy. 

- **Headlines:** Set with tight letter-spacing and bold weights to create a strong visual hierarchy. Use the 'Display' scale for marketing hero sections.
- **Body Text:** Uses the regular weight for maximum readability. Line heights are kept generous (1.5x) to ensure long-form product descriptions are easy to digest.
- **Labels:** Used for buttons, category tags, and micro-copy. These are set in semi-bold to distinguish them from body content at smaller sizes.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The rhythm is based on an **8px linear scale**, ensuring mathematical harmony across all components.

- **Desktop:** 1280px max-width container with 24px gutters. Use 40px side margins to allow the content to "breathe" against the screen edges.
- **Mobile:** 16px side margins with 16px gutters.
- **Vertical Spacing:** Use `stack-md` (24px) for related group elements and `stack-lg` (48px) for distinct sections. 
- **Alignment:** Content should predominantly be left-aligned to support natural scanning patterns, especially in data-heavy seller dashboards.

## Elevation & Depth

To maintain a clean and lightweight feel, depth is communicated through **Tonal Layering** and **Ambient Shadows**.

- **Level 0 (Base):** White (#FFFFFF) background.
- **Level 1 (Cards/Surface):** A very subtle 1px border (#E2E8F0) with no shadow. Used for secondary content or inactive states.
- **Level 2 (Active/Raised):** Used for product cards. Features a soft, diffused shadow: `box-shadow: 0 4px 20px -2px rgba(49, 46, 129, 0.05)`. The hint of Indigo in the shadow keeps the depth feeling integrated with the brand.
- **Level 3 (Interactive/Overlay):** Used for dropdowns and modals. Features a more pronounced shadow: `box-shadow: 0 12px 32px -4px rgba(49, 46, 129, 0.12)`.

## Shapes

The shape language is defined by **Moderate Rounding**, striking a balance between the rigid "seriousness" of finance and the "friendliness" of a social marketplace.

- **Standard Elements:** Buttons, input fields, and tags use a `0.5rem` (8px) radius.
- **Large Elements:** Product cards and featured banners use a `1rem` (16px) radius to create a soft, inviting frame for imagery.
- **Small Elements:** Tooltips and checkboxes use a `0.25rem` (4px) radius to maintain clarity at scale.

## Components

### Buttons
- **Primary:** Solid Deep Indigo with White text. 8px border radius. On hover, darken the background slightly.
- **Secondary:** White background with Deep Indigo border (1px) and text.
- **Success:** Solid Mint background for "Checkout" or "Payment Complete" actions.

### Input Fields
- **Default:** 1px border (#E2E8F0) with 8px radius. Use Plus Jakarta Sans 16px for text to prevent iOS zoom-on-focus.
- **Focus:** 2px border in Deep Indigo with a subtle outer glow.

### Cards
- **Product Card:** Level 2 elevation, 16px radius. Title in `label-lg`, price in `headline-md` using the Mint color to signify value.

### Chips & Tags
- **Category Tags:** Subtle Indigo tint (#EEF2FF) with Deep Indigo text. 
- **Status Chips:** Use Mint background with dark green text for "In Stock" and Amber background for "Low Stock."

### Seller Dashboard Specifics
- **Data Tables:** Minimalist style. No vertical borders, only horizontal dividers (#F1F5F9). Header text in `label-sm` uppercase.