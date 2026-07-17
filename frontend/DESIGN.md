---
name: Midnight Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#b9c8de'
  on-secondary: '#233143'
  secondary-container: '#39485a'
  on-secondary-container: '#a7b6cc'
  tertiary: '#bdc2ff'
  on-tertiary: '#131e8c'
  tertiary-container: '#7c87f3'
  on-tertiary-container: '#081486'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#e0e0ff'
  tertiary-fixed-dim: '#bdc2ff'
  on-tertiary-fixed: '#000767'
  on-tertiary-fixed-variant: '#2f3aa3'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-padding-desktop: 40px
  container-padding-mobile: 20px
  gutter: 24px
  stack-gap: 16px
---

## Brand & Style

This design system embodies a premium, futuristic AI SaaS aesthetic that prioritizes focus and clarity. The brand personality is sophisticated and high-performance, designed for users who demand professional-grade productivity tools. 

The visual style is a refined mix of **Glassmorphism** and **Minimalism**. It utilizes deep, dark surfaces to reduce eye strain, accented by high-contrast primary elements that guide the user's attention. The use of translucent layers and backdrop blurs creates a sense of spatial depth without clutter, while subtle glows and light-leaks suggest the "intelligence" humming beneath the surface of the interface.

## Colors

The palette is anchored in a **Deep Midnight** (#0f172a) base, providing a high-end "pro" feel. 
- **Primary Indigo (#6366f1):** Used exclusively for primary actions, focus states, and key brand moments. It should "pop" against the dark background.
- **Translucent Surfaces:** All container elements use semi-transparent fills with `backdrop-filter: blur(16px)` to create the signature glass effect.
- **Accents:** Soft indigo glows (low-opacity gradients) are used sparingly behind primary cards to indicate "active" AI processing or high-priority items.

## Typography

This design system uses **Inter** exclusively to maintain a systematic, utilitarian, and clean appearance. 
- **Hierarchy:** High contrast in font weights is used to define importance. Headlines use Bold or Semi-Bold with slight negative letter-spacing for a modern "tech" look.
- **Readability:** Body text uses a slightly lighter weight (Regular) with generous line-height to ensure comfort in a dark-mode environment.
- **Labels:** Small labels and metadata should use Medium or Semi-Bold weights to remain legible at smaller scales.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with generous white space (or "dark space") to evoke a sense of premium quality. 
- **Desktop:** A 12-column grid with 24px gutters. Sections are separated by large vertical margins (80px - 120px) to allow the glassmorphic elements "room to breathe."
- **Mobile:** A 4-column grid with 16px gutters and 20px side margins. 
- **Rhythm:** Spacing is strictly based on a 4px/8px scale. Use wider internal padding in cards (32px) to reinforce the "spacious" and "elegant" brand values.

## Elevation & Depth

Depth is not communicated through heavy shadows, but through **Tonal Layering and Blur**.
- **Level 0 (Background):** Solid Midnight (#0f172a).
- **Level 1 (Secondary UI):** Translucent indigo-tinted surface with 4px blur.
- **Level 2 (Primary Cards/Modals):** Translucent indigo-tinted surface with 16px blur and a 1px border at 10% white opacity.
- **Glows:** High-elevation elements (like active AI chat bubbles) feature a subtle #6366f1 outer glow with 20% opacity and 32px spread to simulate light emission.

## Shapes

The design system uses a **Rounded** shape language to soften the technical nature of the AI. 
- **Standard UI Elements:** Buttons and inputs use a 0.5rem (8px) radius.
- **Feature Cards:** Larger containers and glass panes use a `rounded-2xl` (1rem / 16px) radius to emphasize the premium, friendly feel.
- **Selection States:** Use "pill" shapes for tags and status indicators to contrast against the structured grid.

## Components

- **Buttons:** 
  - *Primary:* Solid Indigo (#6366f1) with white text. Apply a very subtle inner-top white highlight (1px, 10% opacity) for a tactile feel.
  - *Ghost:* Transparent background with a 1px white/10 border.
- **Cards:** Use the "Glass Level 2" style. All cards must have a 1px top-down linear gradient border (white/15 to white/0) to simulate light hitting the top edge.
- **Input Fields:** Darker than the background (#0b1120) with a 1px border. On focus, the border glows Indigo and the background lightens slightly.
- **Chips/Badges:** Small, pill-shaped elements with a low-opacity Indigo background (primary/10) and Indigo text.
- **AI Specific:** 
  - *Sparkle Icons:* Use small indigo sparkles to indicate AI-generated content.
  - *Progress Bars:* Use a shimmering gradient animation (Indigo to Tertiary Indigo) to indicate "thinking" or "processing" states.