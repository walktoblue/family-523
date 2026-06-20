---
name: Warm Kinship System
colors:
  surface: '#fef9f1'
  surface-dim: '#ded9d2'
  surface-bright: '#fef9f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3eb'
  surface-container: '#f2ede5'
  surface-container-high: '#ece8e0'
  surface-container-highest: '#e7e2da'
  on-surface: '#1d1c17'
  on-surface-variant: '#524438'
  inverse-surface: '#32302b'
  inverse-on-surface: '#f5f0e8'
  outline: '#847467'
  outline-variant: '#d7c3b3'
  surface-tint: '#89510d'
  primary: '#864f0a'
  on-primary: '#ffffff'
  primary-container: '#a46723'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb873'
  secondary: '#376847'
  on-secondary: '#ffffff'
  secondary-container: '#b6edc2'
  on-secondary-container: '#3b6d4b'
  tertiary: '#825024'
  on-tertiary: '#ffffff'
  tertiary-container: '#9f683a'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcbf'
  primary-fixed-dim: '#ffb873'
  on-primary-fixed: '#2d1600'
  on-primary-fixed-variant: '#6a3b00'
  secondary-fixed: '#b9efc5'
  secondary-fixed-dim: '#9dd3aa'
  on-secondary-fixed: '#00210e'
  on-secondary-fixed-variant: '#1e5031'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#fcb883'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#693c11'
  background: '#fef9f1'
  on-background: '#1d1c17'
  surface-variant: '#e7e2da'
typography:
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 22px
    fontWeight: '600'
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
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
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
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 20px
---

## Brand & Style

This design system is built to evoke the warmth, heritage, and continuity of a family lineage. The brand personality is **nurturing, archival, and respectful**, bridging the gap between traditional Korean family values and modern digital connectivity. The target audience includes multi-generational family members, from tech-savvy youth to seniors, requiring an interface that feels like a cherished physical photo album.

The design style is a blend of **Minimalism** and **Tactile/Skeuomorphic** elements. It utilizes heavy whitespace to provide breathing room for complex genealogical information, while using soft shadows and paper-like textures to mimic the tactile feel of traditional Korean stationery (*Hanji*). Nature-themed motifs, particularly the "Family Tree," serve as the central visual metaphor, emphasizing growth and deep roots.

## Colors

The palette is inspired by natural earth tones found in traditional Korean architecture and landscapes. 

- **Background (#FDF8F0):** A warm cream that reduces eye strain and provides a soft, paper-like canvas.
- **Primary Accent (#C17F3A):** A golden-brown "Ochre" used for main calls to action, representing the sun and harvest.
- **Secondary Accent (#4A7C59):** A "Forest Green" representing the family tree, growth, and stability.
- **Tertiary Accent (#8E5A2D):** A deeper "Bark" brown for subtle decorative elements or secondary highlights.
- **Surface:** Pure white (#FFFFFF) is reserved strictly for cards and floating containers to ensure they pop against the cream background.

## Typography

The typography strategy focuses on the "Literary Heritage" aesthetic. 

- **Headlines:** Uses `notoSerif` (to be paired with *Nanum Myeongjo* or *Batang* for Korean glyphs). This provides a sense of authority, tradition, and elegance, making family names and titles feel significant.
- **Body & Labels:** Uses `plusJakartaSans` (to be paired with *Pretendard* for Korean glyphs). This sans-serif is rounded and friendly, ensuring that long genealogical descriptions or instructions are highly readable and approachable for all ages.
- **Hierarchy:** Maintain high contrast between headlines and body text. Use `label-md` for structural elements like "관계" (Relationship) or "생년월일" (Date of Birth).

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** approach for desktop to maintain the "album" look, while transitioning to a fluid stack for mobile devices.

- **Desktop (1024px+):** 12-column grid with 24px gutters and 40px side margins. Content is centered within a 1200px container.
- **Tablet (768px - 1023px):** 8-column grid with 20px gutters and 32px margins.
- **Mobile (< 767px):** 4-column fluid grid. Margins are reduced to 16px to maximize space for family tree nodes.
- **Vertical Rhythm:** Use the 8px base unit. Card padding should be generous (`spacing.md`) to create an airy, unhurried feel.

## Elevation & Depth

This design system uses **Ambient Shadows** and **Tonal Layers** to create a sense of physical layering, reminiscent of photos placed on a page.

- **Level 0 (Background):** The `#FDF8F0` cream surface.
- **Level 1 (Cards):** Pure white surfaces with a very soft, diffused shadow: `box-shadow: 0 4px 20px rgba(193, 127, 58, 0.08);`. Note the slight Primary Accent tint in the shadow to keep the warmth.
- **Level 2 (Interactive/Hover):** When a user interacts with a family member node or a card, the shadow deepens and the element lifts slightly (2px translation) to signal interactivity.
- **Overlays:** Modals use a semi-transparent blur of the background color rather than a harsh black overlay to maintain the "warm" atmosphere.

## Shapes

The shape language is defined by organic, friendly curves. 

- **Standard Radius:** 16px (`rounded-lg`) is used for all primary cards, input fields, and containers.
- **Buttons:** Use `rounded-xl` (24px) for a soft, pill-like appearance that feels safe and inviting.
- **Avatars:** Family photos should be displayed in "Squircle" shapes rather than perfect circles to maintain a modern yet organic look.
- **Decorative Elements:** Use wavy dividers or "leaf" shaped badges to reinforce the nature/tree theme.

## Components

- **Buttons:** 
  - *Primary:* Ochre (#C17F3A) background with white text. Bold, rounded corners.
  - *Secondary:* Forest Green (#4A7C59) outline or soft green background for "Add Member" or "Share" actions.
- **Family Cards:** White background, 16px radius, featuring a "squircle" photo on the left, Name (Serif), and Relationship (Sans-serif) on the right.
- **Input Fields:** Thick 2px border in a light version of the primary color or a neutral grey. Backgrounds remain white. Focus state uses a soft Ochre glow.
- **Chips/Badges:** Use the Forest Green for status indicators like "직계" (Direct Line) or "방계" (Collateral Line), with low-opacity backgrounds.
- **The "Tree" Node:** A specialized component for the kinship map. These should be connected by thin, rounded lines in Primary Accent (#C17F3A) with 🌳 emojis used as decorative markers for roots or major branch starts.
- **Navigation:** A simple, bottom-docked bar for mobile or a clean top-nav for desktop, utilizing icons with soft, rounded strokes.